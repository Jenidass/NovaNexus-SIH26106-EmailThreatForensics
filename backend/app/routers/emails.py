from fastapi import APIRouter, HTTPException, UploadFile, File
from email import policy
from email.parser import BytesParser
from email.utils import parseaddr
from datetime import datetime, timezone
import re

import whois

from app.data.mock_data import INVESTIGATIONS, get_investigation
from app.models.schemas import Investigation


router = APIRouter(
    prefix="/api/emails",
    tags=["Email Investigation"]
)


# =========================================================
# HELPER FUNCTIONS
# =========================================================

def clean_whois_value(value):
    """
    Convert WHOIS values into a clean string.

    WHOIS libraries may return:
    - string
    - list
    - None
    """

    if value is None:
        return None

    if isinstance(value, list):
        values = [
            str(item).strip()
            for item in value
            if item
        ]

        if values:
            return values[0]

        return None

    value = str(value).strip()

    if not value:
        return None

    return value


def get_domain_information(domain: str):
    """
    Retrieve domain age and organization information
    using WHOIS.

    Returns safe defaults when WHOIS lookup fails.
    """

    result = {
        "domainAgeDays": 0,
        "organization": "Unknown",
    }

    if not domain or domain == "unknown":
        return result

    try:
        domain_info = whois.whois(domain)

        # -------------------------------------------------
        # DOMAIN CREATION DATE
        # -------------------------------------------------

        creation_date = domain_info.creation_date

        # Some WHOIS servers return multiple dates.
        if isinstance(creation_date, list):
            creation_date = next(
                (
                    date
                    for date in creation_date
                    if date
                ),
                None
            )

        if creation_date:

            # Make timezone-aware if necessary
            if creation_date.tzinfo is None:
                creation_date = creation_date.replace(
                    tzinfo=timezone.utc
                )

            now = datetime.now(timezone.utc)

            age_days = (
                now - creation_date
            ).days

            result["domainAgeDays"] = max(
                0,
                age_days
            )

        # -------------------------------------------------
        # ORGANIZATION
        # -------------------------------------------------

        organization_fields = [
            "org",
            "organization",
            "registrant_organization",
            "registrant_name",
            "name",
            "registrant",
        ]

        organization = None

        for field in organization_fields:

            try:
                value = getattr(
                    domain_info,
                    field,
                    None
                )
            except Exception:
                value = None

            value = clean_whois_value(value)

            if value:
                organization = value
                break

        # -------------------------------------------------
        # FALLBACK TO REGISTRAR
        # -------------------------------------------------

        if not organization:

            registrar = clean_whois_value(
                getattr(
                    domain_info,
                    "registrar",
                    None
                )
            )

            if registrar:
                organization = (
                    f"Registrar: {registrar}"
                )

        if organization:
            result["organization"] = organization

    except Exception:
        # WHOIS lookup may fail because of:
        # - unavailable WHOIS server
        # - rate limiting
        # - privacy protection
        # - unsupported TLD
        # - network error
        pass

    return result


def get_free_mail_provider(domain: str):
    """
    Detect common free/public email providers.
    """

    free_domains = {
        "gmail.com",
        "googlemail.com",
        "yahoo.com",
        "yahoo.co.in",
        "outlook.com",
        "hotmail.com",
        "live.com",
        "msn.com",
        "icloud.com",
        "me.com",
        "protonmail.com",
        "proton.me",
        "aol.com",
        "zoho.com",
        "gmx.com",
        "mail.com",
        "yandex.com",
    }

    return domain.lower() in free_domains


def extract_domain_from_email(email_address: str):
    """
    Safely extract domain from email address.
    """

    if not email_address:
        return "unknown"

    if "@" not in email_address:
        return "unknown"

    return (
        email_address
        .split("@", 1)[1]
        .strip()
        .lower()
    )


# =========================================================
# GET ALL INVESTIGATIONS
# =========================================================

@router.get(
    "",
    response_model=list[Investigation]
)
def get_emails():

    return INVESTIGATIONS


# =========================================================
# GET SINGLE INVESTIGATION
# =========================================================

@router.get(
    "/{investigation_id}",
    response_model=Investigation
)
def get_email(investigation_id: str):

    investigation = get_investigation(
        investigation_id
    )

    if not investigation:

        raise HTTPException(
            status_code=404,
            detail="Investigation not found",
        )

    return investigation


# =========================================================
# UPLOAD AND ANALYZE EMAIL
# =========================================================

@router.post("/upload")
async def upload_email(
    file: UploadFile = File(...)
):

    # =====================================================
    # VALIDATE FILE
    # =====================================================

    if not file.filename:

        raise HTTPException(
            status_code=400,
            detail="No file provided",
        )

    # =====================================================
    # READ FILE
    # =====================================================

    content = await file.read()

    if not content:

        raise HTTPException(
            status_code=400,
            detail="Uploaded file is empty",
        )

    # =====================================================
    # PARSE EMAIL
    # =====================================================

    try:

        message = BytesParser(
            policy=policy.default
        ).parsebytes(content)

    except Exception as exc:

        raise HTTPException(
            status_code=400,
            detail=(
                "Unable to parse email file: "
                f"{exc}"
            ),
        )

    # =====================================================
    # BASIC EMAIL HEADERS
    # =====================================================

    subject = message.get(
        "Subject",
        "(No subject)"
    )

    from_header = message.get(
        "From",
        ""
    )

    to_header = message.get(
        "To",
        ""
    )

    cc_header = message.get(
        "Cc",
        ""
    )

    date_header = message.get(
        "Date",
        ""
    )

    message_id = message.get(
        "Message-ID",
        ""
    )

    return_path = message.get(
        "Return-Path",
        ""
    )

    # =====================================================
    # EXTRACT SENDER
    # =====================================================

    sender_name, sender_email = parseaddr(
        from_header
    )

    if not sender_email:

        sender_email = (
            from_header
            or "unknown"
        )

    sender_domain = extract_domain_from_email(
        sender_email
    )

    # =====================================================
    # WHOIS DOMAIN INTELLIGENCE
    # =====================================================

    domain_information = (
        get_domain_information(
            sender_domain
        )
    )

    domain_age_days = (
        domain_information[
            "domainAgeDays"
        ]
    )

    organization = (
        domain_information[
            "organization"
        ]
    )

    # =====================================================
    # FREE MAIL PROVIDER
    # =====================================================

    free_mail_provider = (
        get_free_mail_provider(
            sender_domain
        )
    )

    # =====================================================
    # AUTHENTICATION HEADERS
    # =====================================================

    auth_results = message.get(
        "Authentication-Results",
        ""
    )

    received_spf = message.get(
        "Received-SPF",
        ""
    )

    spf = "none"
    dkim = "none"
    dmarc = "none"

    auth_lower = str(
        auth_results
    ).lower()

    spf_lower = str(
        received_spf
    ).lower()

    # -----------------------------------------------------
    # SPF
    # -----------------------------------------------------

    if (
        "spf=pass" in auth_lower
        or "spf=pass" in spf_lower
    ):

        spf = "pass"

    elif (
        "spf=fail" in auth_lower
        or "spf=fail" in spf_lower
    ):

        spf = "fail"

    elif (
        "spf=softfail" in auth_lower
        or "spf=softfail" in spf_lower
    ):

        spf = "neutral"

    # -----------------------------------------------------
    # DKIM
    # -----------------------------------------------------

    if "dkim=pass" in auth_lower:

        dkim = "pass"

    elif "dkim=fail" in auth_lower:

        dkim = "fail"

    elif "dkim=neutral" in auth_lower:

        dkim = "neutral"

    # -----------------------------------------------------
    # DMARC
    # -----------------------------------------------------

    if "dmarc=pass" in auth_lower:

        dmarc = "pass"

    elif "dmarc=fail" in auth_lower:

        dmarc = "fail"

    elif "dmarc=neutral" in auth_lower:

        dmarc = "neutral"

    # =====================================================
    # COUNT ROUTING HOPS
    # =====================================================

    received_headers = message.get_all(
        "Received",
        []
    )

    hop_count = len(
        received_headers
    )

    # =====================================================
    # GET EMAIL BODY
    # =====================================================

    body_parts = []

    if message.is_multipart():

        for part in message.walk():

            content_type = (
                part.get_content_type()
            )

            if content_type in (
                "text/plain",
                "text/html",
            ):

                try:

                    body_parts.append(
                        part.get_content()
                    )

                except Exception:
                    pass

    else:

        try:

            body_parts.append(
                message.get_content()
            )

        except Exception:
            pass

    body = "\n".join(
        str(part)
        for part in body_parts
    )

    # =====================================================
    # EXTRACT HTML URLS
    # =====================================================

    urls = []

    for part in message.walk():

        if (
            part.get_content_type()
            != "text/html"
        ):
            continue

        try:

            html = part.get_content()

            href_urls = re.findall(
                r'''href\s*=\s*["'](https?://[^"']+)["']''',
                html,
                flags=re.IGNORECASE,
            )

            urls.extend(
                href_urls
            )

        except Exception:
            pass

    # =====================================================
    # REMOVE DUPLICATE URLS
    # =====================================================

    urls = list(
        dict.fromkeys(urls)
    )

    # =====================================================
    # FILTER NON-SECURITY URLs
    # =====================================================

    filtered_urls = []

    for url in urls:

        url_lower = url.lower()

        base_url = (
            url_lower
            .split("?", 1)[0]
        )

        # -------------------------------------------------
        # Google fonts
        # -------------------------------------------------

        if (
            "fonts.googleapis.com"
            in url_lower
        ):
            continue

        # -------------------------------------------------
        # Font files
        # -------------------------------------------------

        if base_url.endswith(
            (
                ".woff",
                ".woff2",
                ".ttf",
                ".otf",
                ".eot",
            )
        ):
            continue

        # -------------------------------------------------
        # Images
        # -------------------------------------------------

        if base_url.endswith(
            (
                ".png",
                ".jpg",
                ".jpeg",
                ".gif",
                ".svg",
                ".webp",
                ".ico",
            )
        ):
            continue

        # -------------------------------------------------
        # Unsubscribe links
        # -------------------------------------------------

        if (
            "unsubscribe" in url_lower
            or "optout" in url_lower
            or "preferences" in url_lower
        ):
            continue

        # -------------------------------------------------
        # Tracking pixels
        # -------------------------------------------------

        if (
            "tracking" in url_lower
            and (
                ".png" in url_lower
                or ".gif" in url_lower
                or ".jpg" in url_lower
            )
        ):
            continue

        filtered_urls.append(
            url
        )

    urls = list(
        dict.fromkeys(
            filtered_urls
        )
    )

    # =====================================================
    # EXTRACT IPv4 ADDRESSES
    # =====================================================

    ips = re.findall(
        r'\b(?:\d{1,3}\.){3}\d{1,3}\b',
        body,
    )

    # Remove duplicates
    ips = list(
        dict.fromkeys(ips)
    )

    # =====================================================
    # EXTRACT ATTACHMENTS
    # =====================================================

    attachments = []

    for part in message.walk():

        filename = part.get_filename()

        if filename:

            payload = part.get_payload(
                decode=True
            )

            attachments.append(
                {
                    "fileName": filename,
                    "fileType": (
                        part.get_content_type()
                    ),
                    "sizeKb": round(
                        len(
                            payload or b""
                        ) / 1024,
                        2,
                    ),
                }
            )

    # =====================================================
    # BASIC HEURISTIC THREAT ANALYSIS
    # =====================================================

    threat_score = 0

    findings = []

    suspicious_words = [
        "urgent",
        "verify your account",
        "password",
        "login",
        "click here",
        "account suspended",
        "payment required",
        "confirm your identity",
        "security alert",
        "verify your identity",
        "reset your password",
        "unusual activity",
        "account locked",
    ]

    body_lower = body.lower()

    subject_lower = subject.lower()

    # =====================================================
    # SUSPICIOUS CONTENT
    # =====================================================

    content_matches = [
        word
        for word in suspicious_words
        if (
            word in body_lower
            or word in subject_lower
        )
    ]

    if content_matches:

        threat_score += min(
            30,
            len(content_matches) * 5,
        )

        findings.append(
            "Potential social-engineering language detected: "
            + ", ".join(
                content_matches[:5]
            )
        )

    # =====================================================
    # AUTHENTICATION FAILURES
    # =====================================================

    auth_failures = 0

    if spf == "fail":

        auth_failures += 1

        findings.append(
            "SPF authentication failed."
        )

    if dkim == "fail":

        auth_failures += 1

        findings.append(
            "DKIM authentication failed."
        )

    if dmarc == "fail":

        auth_failures += 1

        findings.append(
            "DMARC authentication failed."
        )

    threat_score += (
        auth_failures * 15
    )

    # =====================================================
    # DOMAIN AGE ANALYSIS
    # =====================================================

    if domain_age_days > 0:

        if domain_age_days < 30:

            threat_score += 15

            findings.append(
                "Sender domain is less than "
                "30 days old."
            )

        elif domain_age_days < 90:

            threat_score += 10

            findings.append(
                "Sender domain is less than "
                "90 days old."
            )

    # =====================================================
    # DOMAIN ORGANIZATION ANALYSIS
    # =====================================================

    if organization == "Unknown":

        findings.append(
            "WHOIS organization information "
            "is unavailable or privacy protected."
        )

    # =====================================================
    # URL ANALYSIS
    # =====================================================

    if urls:

        threat_score += min(
            20,
            len(urls) * 5,
        )

        findings.append(
            f"{len(urls)} URL(s) extracted "
            "from the email."
        )

    # =====================================================
    # ATTACHMENT ANALYSIS
    # =====================================================

    if attachments:

        threat_score += min(
            20,
            len(attachments) * 10,
        )

        for attachment in attachments:

            filename_lower = (
                attachment[
                    "fileName"
                ].lower()
            )

            risky_extensions = [
                ".exe",
                ".scr",
                ".js",
                ".vbs",
                ".bat",
                ".cmd",
                ".ps1",
                ".hta",
                ".html",
                ".htm",
                ".xlsm",
                ".docm",
                ".iso",
                ".img",
            ]

            if any(
                filename_lower.endswith(
                    ext
                )
                for ext in risky_extensions
            ):

                threat_score += 10

                findings.append(
                    "Potentially risky attachment "
                    "detected: "
                    + attachment[
                        "fileName"
                    ]
                )

            else:

                findings.append(
                    "Attachment detected: "
                    + attachment[
                        "fileName"
                    ]
                )

    # =====================================================
    # IP ANALYSIS
    # =====================================================

    if ips:

        findings.append(
            f"{len(ips)} IP address(es) "
            "extracted from the email."
        )

        threat_score += min(
            10,
            len(ips) * 2,
        )

    # =====================================================
    # CLAMP SCORE
    # =====================================================

    threat_score = min(
        100,
        threat_score,
    )

    # =====================================================
    # DETERMINE SEVERITY
    # =====================================================

    if threat_score >= 80:

        severity = "critical"

    elif threat_score >= 60:

        severity = "high"

    elif threat_score >= 35:

        severity = "medium"

    elif threat_score >= 15:

        severity = "low"

    else:

        severity = "clean"

    # =====================================================
    # CLASSIFICATION
    # =====================================================

    if threat_score >= 80:

        classification = "Phishing"

    elif attachments:

        classification = (
            "Malware / Suspicious Attachment"
        )

    elif urls:

        classification = (
            "Suspicious Email"
        )

    elif threat_score >= 35:

        classification = "Suspicious"

    else:

        classification = "Benign"

    # =====================================================
    # IOC GENERATION
    # =====================================================

    indicators = []

    for ip in ips:

        indicators.append(
            {
                "type": "IP",
                "value": ip,
                "risk": severity,
            }
        )

    for url in urls:

        indicators.append(
            {
                "type": "URL",
                "value": url,
                "risk": severity,
            }
        )

    if sender_domain != "unknown":

        indicators.append(
            {
                "type": "Domain",
                "value": sender_domain,
                "risk": severity,
            }
        )

    # =====================================================
    # GENERATE INVESTIGATION ID
    # =====================================================

    investigation_id = (
        f"INV-"
        f"{datetime.now().strftime('%Y%m%d%H%M%S%f')}"
    )

    # =====================================================
    # RETURN ANALYSIS RESULT
    # =====================================================

    return {

        "message": (
            "Email analyzed successfully"
        ),

        "status": "completed",

        "investigation": {

            "id": investigation_id,

            "fileName": file.filename,

            "completedAt": (
                datetime.now().isoformat()
            ),

            # =============================================
            # METADATA
            # =============================================

            "metadata": {

                "subject": subject,

                "from": sender_email,

                "to": [
                    email.strip()
                    for email in to_header.split(",")
                    if email.strip()
                ],

                "cc": [
                    email.strip()
                    for email in cc_header.split(",")
                    if email.strip()
                ],

                "date": date_header,

                "messageId": message_id,

                "returnPath": return_path,

                "spf": spf,

                "dkim": dkim,

                "dmarc": dmarc,

                "attachmentCount": len(
                    attachments
                ),

                "hopCount": hop_count,
            },

            # =============================================
            # THREAT SCORE
            # =============================================

            "threatScore": {

                "overall": threat_score,

                "level": severity,

                "headerRisk": min(
                    100,
                    auth_failures * 25,
                ),

                "contentRisk": min(
                    100,
                    len(
                        content_matches
                    ) * 10,
                ),

                "linkRisk": min(
                    100,
                    len(urls) * 15,
                ),

                "attachmentRisk": min(
                    100,
                    len(attachments) * 25,
                ),

                "reputationRisk": 0,
            },

            # =============================================
            # SENDER
            # =============================================

            "sender": {

                "displayName": (
                    sender_name
                    or sender_email
                ),

                "address": sender_email,

                "domain": sender_domain,

                # REAL WHOIS DATA
                "domainAgeDays": (
                    domain_age_days
                ),

                "spoofed": (
                    dmarc == "fail"
                ),

                "freeMailProvider": (
                    free_mail_provider
                ),

                # -------------------------------------------------
                # IMPORTANT:
                # WHOIS DOES NOT PROVIDE ABUSE REPORT COUNTS.
                # Keep 0 until threat-intelligence API is connected.
                # -------------------------------------------------

                "previousReports": 0,

                "organization": organization,
            },

            # =============================================
            # NETWORK
            # =============================================

            "network": {

                "ip": (
                    ips[0]
                    if ips
                    else "Unknown"
                ),

                "country": "Unknown",

                "city": "Unknown",

                "isp": "Unknown",

                "asn": "Unknown",

                "latitude": 0,

                "longitude": 0,

                "blacklisted": False,

                "vpnOrProxy": False,
            },

            # =============================================
            # SUSPICIOUS LINKS
            # =============================================

            "suspiciousLinks": [

                {
                    "id": (
                        f"link-{index}"
                    ),

                    "url": url,

                    "displayText": url,

                    "riskLevel": severity,

                    "reason": (
                        "URL extracted from "
                        "email content."
                    ),
                }

                for index, url
                in enumerate(
                    urls,
                    start=1
                )
            ],

            # =============================================
            # SUSPICIOUS ATTACHMENTS
            # =============================================

            "suspiciousAttachments": [

                {
                    "id": (
                        f"attachment-{index}"
                    ),

                    "fileName": (
                        attachment[
                            "fileName"
                        ]
                    ),

                    "fileType": (
                        attachment[
                            "fileType"
                        ]
                    ),

                    "sizeKb": (
                        attachment[
                            "sizeKb"
                        ]
                    ),

                    "riskLevel": severity,

                    "reason": (
                        "Attachment detected "
                        "during email analysis."
                    ),

                    "hash": "",
                }

                for index, attachment
                in enumerate(
                    attachments,
                    start=1
                )
            ],

            # =============================================
            # IOCS
            # =============================================

            "iocs": [

                {
                    "id": (
                        f"ioc-{index}"
                    ),

                    "type": (
                        indicator[
                            "type"
                        ].lower()
                    ),

                    "value": (
                        indicator[
                            "value"
                        ]
                    ),

                    "confidence": 75,

                    "source": (
                        "Email analysis"
                    ),

                    "firstSeen": (
                        datetime.now().strftime(
                            "%Y-%m-%d"
                        )
                    ),
                }

                for index, indicator
                in enumerate(
                    indicators,
                    start=1
                )
            ],

            # =============================================
            # EVIDENCE
            # =============================================

            "evidence": [

                {
                    "id": (
                        f"evidence-{index}"
                    ),

                    "title": finding,

                    "description": finding,

                    "severity": severity,

                    "category": (
                        "authentication"
                        if (
                            "authentication"
                            in finding.lower()
                            or "spf"
                            in finding.lower()
                            or "dkim"
                            in finding.lower()
                            or "dmarc"
                            in finding.lower()
                        )
                        else (
                            "attachment"
                            if "attachment"
                            in finding.lower()
                            else (
                                "link"
                                if "url"
                                in finding.lower()
                                else (
                                    "network"
                                    if (
                                        "domain"
                                        in finding.lower()
                                        or "ip"
                                        in finding.lower()
                                    )
                                    else "content"
                                )
                            )
                        )
                    ),
                }

                for index, finding
                in enumerate(
                    findings,
                    start=1
                )
            ],

            # =============================================
            # VERDICT
            # =============================================

            "verdict": (
                classification
                + " — "
                + (
                    "Potential threat detected"
                    if threat_score >= 35
                    else
                    "No significant threat indicators detected"
                )
            ),

            # =============================================
            # RECOMMENDED ACTION
            # =============================================

            "recommendedAction": (
                "Quarantine the message and "
                "investigate the sender, URLs "
                "and attachments."
                if threat_score >= 60
                else
                "Review the message carefully "
                "before interacting with links "
                "or attachments."
                if threat_score >= 35
                else
                "No immediate action required. "
                "Message appears low risk."
            ),
        },
    }