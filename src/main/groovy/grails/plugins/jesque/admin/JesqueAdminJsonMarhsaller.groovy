package grails.plugins.jesque.admin

import grails.converters.JSON
import groovy.util.logging.Log
import net.greghaines.jesque.Job
import net.greghaines.jesque.JobFailure
import net.greghaines.jesque.WorkerStatus
import net.greghaines.jesque.meta.QueueInfo
import net.greghaines.jesque.meta.WorkerInfo

@Log
class JesqueAdminJsonMarhsaller {

    static void init() {
        log.info "Registering JSON Marshallers for JesqueAdmin"
        JSON.registerObjectMarshaller(WorkerInfo.State) { WorkerInfo.State s ->
            s.toString()
        }

        JSON.registerObjectMarshaller(QueueInfo) { QueueInfo queueInfo ->
            [
                    jobs: queueInfo.jobs,
                    name: queueInfo.name,
                    size: queueInfo.size
            ]
        }

        JSON.registerObjectMarshaller(WorkerInfo) { WorkerInfo workerInfo ->
            [
                    failed   : workerInfo.failed,
                    host     : workerInfo.host,
                    name     : workerInfo.name,
                    pid      : workerInfo.pid,
                    processed: workerInfo.processed,
                    queues   : workerInfo.queues,
                    started  : workerInfo.started,
                    state    : workerInfo.state,
                    status   : workerInfo.status
            ]
        }
        JSON.registerObjectMarshaller(WorkerStatus) { WorkerStatus workerStatus ->
            [
                    queue  : workerStatus.queue,
                    payload: workerStatus.payload,
                    paused : workerStatus.paused,
                    runAt  : workerStatus.runAt

            ]
        }

        JSON.registerObjectMarshaller(Job) { Job job ->
            [
                    className: job.className,
                    args     : job.args
            ]
        }

        JSON.registerObjectMarshaller(JobFailure) { JobFailure jobFailure ->
            def result = [
                    backtrace: jobFailure.backtrace,
                    error: jobFailure.error,
                    failedAt: jobFailure.failedAt,
                    payload: jobFailure.payload,
                    queue: jobFailure.queue,
                    retriedAt: jobFailure.retriedAt,
                    throwable: jobFailure.throwable,
                    throwableString: jobFailure.throwableString,
                    worker: jobFailure.worker
            ]

            if(jobFailure.hasProperty("id")) {
                result.id = jobFailure.id
            }

            result
        }
    }
}
