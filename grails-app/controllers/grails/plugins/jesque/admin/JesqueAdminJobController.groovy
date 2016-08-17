package grails.plugins.jesque.admin

import grails.converters.JSON

class JesqueAdminJobController extends AbstractJesqueAdminController {

    def failed() {
        sanitizeParams()
        render([
                list : jesqueFailureService.getFailures(params.getLong("offset"), params.getLong("max")),
                total: jesqueFailureService.count
        ] as JSON)
    }

    def requeue(long id) {
        // TODO: not yet supported in FE
        jesqueFailureService.requeue(id.toLong())
        redirect(action: 'failed')
    }

    def remove(long id) {
        // TODO: not yet supported in FE
        jesqueFailureService.remove(id.toLong())

        redirect(action: 'failed')
    }

    def clear() {
        jesqueFailureService.clear()
        render([success: true] as JSON)
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
