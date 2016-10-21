package grails.plugins.jesque.admin

import grails.converters.JSON
import net.greghaines.jesque.JobFailure

class JesqueAdminJobController extends AbstractJesqueAdminController {

    def failed() {
        sanitizeParams()

        long offset = params.getLong("offset", 0)
        def list = jesqueFailureService.getFailures(offset, params.getLong("max"))
        list.eachWithIndex { JobFailure entry, int i ->
            entry.metaClass.id = offset + i
        }
        render([
                list : list,
                total: jesqueFailureService.count
        ] as JSON)
    }

    def retry(Long id) {
        jesqueFailureService.requeue(id)
        jsonRender([success: true])
    }

    def remove(Long id) {
        jesqueFailureService.remove(id)
        jsonRender([success: true])
    }

    def clear() {
        jesqueFailureService.clear()
        jsonRender([success: true])
    }

    def triggers() {
        jsonRender([list: jesqueScheduledService.all.sort { it.trigger.nextFireTime.millis }.collect {
            [name          : it.name,
             cronExpression: it.cronExpression,
             args          : it.args,
             jesqueJobName : it.jesqueJobName,
             jesqueJobQueue: it.jesqueJobQueue,
             trigger       : [
                     jobName     : it.trigger.jobName,
                     nextFireTime: it.trigger.nextFireTime.millis,
                     state       : it.trigger.state.toString(),
                     acquiredBy  : it.trigger.acquiredBy,
             ]]
        }])
    }

    def deleteTrigger(String name) {
        jesqueScheduledService.delete(name)
        jsonRender([success: true])
    }

    def retryAll() {
        // TODO: not yet supported in FE
        jesqueFailureService.count.times {
            jesqueFailureService.requeue(it)
        }

        redirect(action: 'failed')
    }

    def delayed() {
        sanitizeParams()
        jsonRender(
                [
                        list  : jesqueScheduledService.getDelayedJobs(params.getLong("offset"), params.getLong("max")),
                        queues: jesqueScheduledService.delayedQueues
                ]
        )
    }

    def enqueue() {
        def json = request.JSON
        jesqueService.enqueue(json.queue, json.job, json.args)
        jsonRender([success: true])
    }

}
