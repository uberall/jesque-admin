package grails.plugins.jesque.admin

import grails.converters.JSON
import groovy.util.logging.Slf4j
import net.greghaines.jesque.Job
import net.greghaines.jesque.JobFailure
import net.greghaines.jesque.WorkerStatus
import net.greghaines.jesque.meta.QueueInfo
import net.greghaines.jesque.meta.WorkerInfo

@Slf4j
class JesqueAdminJsonMarshaller {

    static void init() {
        log.info "Registering JSON Marshallers for JesqueAdmin"
        JSON.registerObjectMarshaller(WorkerInfo.State) { WorkerInfo.State s ->
            s.toString()
        }

        JSON.registerObjectMarshaller(JesqueJobStatistic) { JesqueJobStatistic jesqueJobStatistic ->
            [
                    job             : jesqueJobStatistic.job,
                    queue           : jesqueJobStatistic.queue,
                    start           : jesqueJobStatistic.start,
                    end             : jesqueJobStatistic.end,
                    runtime         : jesqueJobStatistic.runtime,
                    args            : jesqueJobStatistic.args,
                    throwableString : jesqueJobStatistic.throwableString,
                    throwableMessage: jesqueJobStatistic.throwableMessage,
                    backtrace       : jesqueJobStatistic.backtrace
            ]
        }

        JSON.registerObjectMarshaller(QueueInfo) { QueueInfo queueInfo ->
            [
                    jobs   : queueInfo.jobs,
                    name   : queueInfo.name,
                    size   : queueInfo.size,
                    delayed: queueInfo.delayed
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
                    args     : job.args,
                    vars     : job.vars,
                    runAt    : job.runAt
            ]
        }

        JSON.registerObjectMarshaller(JobFailure) { JobFailure jobFailure ->
            def result = [
                    backtrace      : jobFailure.backtrace,
                    error          : jobFailure.error,
                    failedAt       : jobFailure.failedAt,
                    payload        : jobFailure.payload,
                    queue          : jobFailure.queue,
                    retriedAt      : jobFailure.retriedAt,
                    throwableString: jobFailure.throwableString,
                    worker         : jobFailure.worker
            ]

            if (jobFailure.hasProperty("id")) {
                result.id = jobFailure.id
            }

            result
        }
    }
}
