import { useEffect, useRef, useState } from 'react';
import { PlayCircle, ScanLine, ShieldQuestion } from 'lucide-react';

import type {
  AnalysisStep,
  InvestigationResult,
  InvestigationStage,
  UploadedFile,
} from '../../types/investigation';

import { buildAnalysisSteps } from '../../data/mockInvestigation';

import { UploadZone } from './UploadZone';
import { FileDetailsCard } from './FileDetailsCard';
import { ProcessingView } from './ProcessingView';
import { AnalysisLog } from './AnalysisLog';
import { ThreatScoreCard } from './ThreatScoreCard';
import { SenderInfoCard } from './SenderInfoCard';
import { NetworkInfoCard } from './NetworkInfoCard';
import { SuspiciousLinksCard } from './SuspiciousLinksCard';
import { IOCTable } from './IOCTable';
import { EvidenceFindings } from './EvidenceFindings';
import { CompletionBanner } from './CompletionBanner';

import { Card, CardBody, CardHeader } from '../ui/Card';
import { Button } from '../ui/Button';
import { ErrorPanel } from '../ui/StatePanels';


// ---------------------------------------------------------
// Processing log messages
// ---------------------------------------------------------

const LOG_LINES: string[] = [
  'Initializing forensic sandbox...',
  'Loading MIME parser and header ruleset...',
  'Extracting envelope headers from message...',
  'Resolving Received chain...',
  'Querying SPF/DKIM/DMARC alignment...',
  'Scanning body content for social-engineering patterns...',
  'Extracting embedded URLs and shortener chains...',
  'Cross-referencing sender IP against threat feeds...',
  'Hashing attachments for reputation lookup...',
  'Running heuristic threat-scoring model...',
  'Correlating indicators of compromise...',
  'Compiling forensic report...',
];


// ---------------------------------------------------------
// Duration for each visual processing step
// ---------------------------------------------------------

const STEP_DURATIONS = [700, 900, 650, 1100, 850, 750];


// ---------------------------------------------------------
// Page
// ---------------------------------------------------------

export function NewInvestigationPage() {
  const [stage, setStage] =
    useState<InvestigationStage>('idle');

  const [file, setFile] =
    useState<UploadedFile | null>(null);

  const [steps, setSteps] =
    useState<AnalysisStep[]>(buildAnalysisSteps());

  const [logLines, setLogLines] =
    useState<string[]>([]);

  const [result, setResult] =
    useState<InvestigationResult | null>(null);

  const [simError, setSimError] =
    useState(false);

  const timers =
    useRef<ReturnType<typeof setTimeout>[]>([]);


  // -------------------------------------------------------
  // Cleanup timers when component is unmounted
  // -------------------------------------------------------

  useEffect(() => {
    return () => {
      timers.current.forEach(clearTimeout);
    };
  }, []);


  // -------------------------------------------------------
  // Reset page
  // -------------------------------------------------------

  const reset = () => {
    timers.current.forEach(clearTimeout);
    timers.current = [];

    setStage('idle');
    setFile(null);
    setSteps(buildAnalysisSteps());
    setLogLines([]);
    setResult(null);
    setSimError(false);
  };


  // -------------------------------------------------------
  // File selected
  // -------------------------------------------------------

  const onFileAccepted = (f: UploadedFile) => {
    setFile(f);
    setStage('file-selected');
  };


  // -------------------------------------------------------
  // Start investigation
  // -------------------------------------------------------

  const startInvestigation = async () => {
    if (!file) return;

    // Reset previous timers
    timers.current.forEach(clearTimeout);
    timers.current = [];

    setStage('processing');
    setSteps(buildAnalysisSteps());
    setLogLines([]);
    setResult(null);
    setSimError(false);


    try {
      // ---------------------------------------------------
      // Send actual .eml file to FastAPI backend
      // ---------------------------------------------------

      const formData = new FormData();

      formData.append('file', file.file);


      const response = await fetch(
        'http://127.0.0.1:8000/api/emails/upload',
        {
          method: 'POST',
          body: formData,
        }
      );


      // ---------------------------------------------------
      // Check backend response
      // ---------------------------------------------------

      if (!response.ok) {
        let errorMessage = `Upload failed: ${response.status}`;

        try {
          const errorData = await response.json();

          if (errorData?.detail) {
            errorMessage = errorData.detail;
          }
        } catch {
          // Ignore JSON parsing error
        }

        throw new Error(errorMessage);
      }


      // ---------------------------------------------------
      // Read backend JSON
      // ---------------------------------------------------

      const uploadResult = await response.json();

      console.log(
        'Backend upload response:',
        uploadResult
      );


      // ---------------------------------------------------
      // Backend structure:
      //
      // {
      //   message: "...",
      //   status: "completed",
      //   investigation: {
      //      ...
      //   }
      // }
      // ---------------------------------------------------

      const backendInvestigation =
        uploadResult?.investigation;


      if (!backendInvestigation) {
        throw new Error(
          'Backend did not return an investigation result.'
        );
      }


      // ---------------------------------------------------
      // Visual processing animation
      //
      // The backend has already analyzed the email.
      // These timers only make the forensic pipeline
      // visually understandable for the dashboard demo.
      // ---------------------------------------------------

      let elapsed = 0;


      buildAnalysisSteps().forEach((step, i) => {
        const duration =
          STEP_DURATIONS[i] ?? 700;

        const startTime = elapsed;

        const endTime =
          elapsed + duration;


        // -----------------------------------------------
        // Step starts
        // -----------------------------------------------

        const t1 = setTimeout(() => {
          setSteps((prev) =>
            prev.map((currentStep, index) =>
              index === i
                ? {
                    ...currentStep,
                    status: 'running',
                  }
                : currentStep
            )
          );


          setLogLines((prev) => [
            ...prev,
            LOG_LINES[i * 2] ??
              `Running ${step.label}...`,
          ]);
        }, startTime);


        // -----------------------------------------------
        // Step completes
        // -----------------------------------------------

        const t2 = setTimeout(() => {
          setSteps((prev) =>
            prev.map((currentStep, index) =>
              index === i
                ? {
                    ...currentStep,
                    status: 'done',
                    durationMs: duration,
                  }
                : currentStep
            )
          );


          setLogLines((prev) => [
            ...prev,
            LOG_LINES[i * 2 + 1] ??
              `${step.label} complete`,
          ]);
        }, endTime);


        timers.current.push(t1, t2);

        elapsed = endTime;
      });


      // ---------------------------------------------------
      // Show REAL backend result
      // ---------------------------------------------------

      const finalTimer = setTimeout(() => {
        /*
         * IMPORTANT:
         *
         * Previously this was:
         *
         * const res = generateInvestigationResult(file);
         *
         * That returned the fake PayPal scenario every time.
         *
         * Now we use the actual FastAPI result.
         */

        const realResult =
          backendInvestigation as InvestigationResult;


        console.log(
          'REAL investigation result:',
          realResult
        );


        setResult(realResult);

        setStage('complete');
      }, elapsed + 400);


      timers.current.push(finalTimer);


    } catch (error) {
      console.error(
        'Email upload error:',
        error
      );

      setSimError(false);
      setStage('error');
    }
  };


  // -------------------------------------------------------
  // UI
  // -------------------------------------------------------

  return (
    <div className="max-w-5xl mx-auto px-6 py-8 space-y-6">

      <PageHeader stage={stage} />


      {/* ===================================================
          IDLE
          =================================================== */}

      {stage === 'idle' && (
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <ScanLine className="w-4 h-4 text-[var(--nx-cyan)]" />

              <h3 className="text-sm font-semibold text-[var(--nx-text)]">
                Upload Email for Analysis
              </h3>
            </div>
          </CardHeader>

          <CardBody>
            <UploadZone
              onFileAccepted={onFileAccepted}
            />
          </CardBody>
        </Card>
      )}


      {/* ===================================================
          FILE SELECTED
          =================================================== */}

      {stage === 'file-selected' && file && (
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <ScanLine className="w-4 h-4 text-[var(--nx-cyan)]" />

              <h3 className="text-sm font-semibold text-[var(--nx-text)]">
                Review & Start
              </h3>
            </div>
          </CardHeader>


          <CardBody className="space-y-4">

            <FileDetailsCard
              file={file}
              onRemove={reset}
            />


            <div className="flex justify-end gap-2">

              <Button
                variant="secondary"
                onClick={reset}
              >
                Cancel
              </Button>


              <Button
                variant="primary"
                icon={
                  <PlayCircle className="w-4 h-4" />
                }
                onClick={startInvestigation}
              >
                Start Investigation
              </Button>

            </div>

          </CardBody>
        </Card>
      )}


      {/* ===================================================
          PROCESSING
          =================================================== */}

      {stage === 'processing' && file && (
        <div className="space-y-4">

          <ProcessingView
            steps={steps}
            fileName={file.name}
          />

          <AnalysisLog
            lines={logLines}
          />

        </div>
      )}


      {/* ===================================================
          ERROR
          =================================================== */}

      {stage === 'error' && (
        <Card>
          <CardBody>

            <ErrorPanel
              title="Investigation failed"
              description={
                simError
                  ? 'The forensic engine lost connection while parsing the message. This is a simulated failure for demo purposes.'
                  : 'Something went wrong while analyzing this file.'
              }
              onRetry={reset}
            />

          </CardBody>
        </Card>
      )}


      {/* ===================================================
          COMPLETE
          =================================================== */}

      {stage === 'complete' && result && (
        <div className="space-y-5">

          <CompletionBanner
            result={result}
            onNewInvestigation={reset}
          />


          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">

            <ThreatScoreCard
              score={result.threatScore}
            />


            <SenderInfoCard
              sender={result.sender}
            />


            <NetworkInfoCard
              network={result.network}
            />


            <SuspiciousLinksCard
              links={result.suspiciousLinks}
              attachments={
                result.suspiciousAttachments
              }
            />

          </div>


          <IOCTable
            iocs={result.iocs}
          />


          <EvidenceFindings
            evidence={result.evidence}
          />

        </div>
      )}

    </div>
  );
}


// =========================================================
// PAGE HEADER
// =========================================================

function PageHeader({
  stage,
}: {
  stage: InvestigationStage;
}) {

  const stageLabel: Record<
    InvestigationStage,
    string
  > = {

    idle: 'Awaiting upload',

    'file-selected':
      'File ready',

    processing:
      'Analysis in progress',

    complete:
      'Report ready',

    error:
      'Analysis failed',
  };


  return (
    <div className="flex items-center justify-between flex-wrap gap-3">

      <div>

        <div className="flex items-center gap-2 text-[11px] text-[var(--nx-text-faint)] mb-1">

          <ShieldQuestion className="w-3.5 h-3.5" />

          Nova Nexus · SIH26106

        </div>


        <h1 className="text-lg font-semibold text-[var(--nx-text)]">

          New Email Investigation

        </h1>

      </div>


      <span className="text-[11px] px-2.5 py-1 rounded-full border border-[var(--nx-border-strong)] text-[var(--nx-text-dim)]">

        {stageLabel[stage]}

      </span>

    </div>
  );
}