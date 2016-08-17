import LinkInfo from "../tools/path-info";

export const JOBS_LIST = new LinkInfo('/jobs/1', 'jobsList', 'List', true);
export const JOB_FAILED = new LinkInfo('/jobs/failed/1', 'jobsFailed', 'Failed');
export const JOB_ENQUEUE = new LinkInfo('/jobs/enqueue', 'jobsEnqueue', 'Enqueue');
export const JOB_TRIGGERS = new LinkInfo('/jobs/triggers', 'jobsTriggers', 'Triggers');
export const JOB_DELAYED = new LinkInfo('/jobs/delayed/1', 'jobsDelayed', 'Delayed');
export const WORKER_LIST = new LinkInfo('/workers', 'workersList', 'List');
export const WORKER_MANUAL = new LinkInfo('/workers/start', 'workersStart', 'Start');
export const QUEUE_LIST = new LinkInfo('/queues', 'queuesList', 'Queues');
export const HOME = new LinkInfo('/', 'home', 'Home');

export const JOB_LINKS = [
  JOBS_LIST,
  JOB_FAILED,
  JOB_ENQUEUE,
  JOB_TRIGGERS,
  // JOB_DELAYED
];

export const WORKERS_LINKS = [
  WORKER_LIST,
  WORKER_MANUAL
];
