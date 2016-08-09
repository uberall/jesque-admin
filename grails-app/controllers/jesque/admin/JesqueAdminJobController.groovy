package jesque.admin

import grails.converters.JSON

class JesqueAdminJobController extends AbstractJesqueAdminController {

    private static final BOOLEAN_VALUES = ['true', 'false']

    def failed() {
        sanitizeParams()
        render([
                list : jesqueFailureService.getFailures(params.getLong("offset"), params.getLong("max")),
                total: jesqueFailureService.count
        ] as JSON)
    }

    def requeue(long id) {
        jesqueFailureService.requeue(id.toLong())
        redirect(action: 'failed')
    }

    def remove(long id) {
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
        jesqueFailureService.count.times {
            jesqueFailureService.requeue(it)
        }

        redirect(action: 'failed')
    }

    def delayed() {
        [jobs: jesqueScheduledService.scheduledJobs]
    }

    def enqueue() {
        def json = request.JSON
        jesqueService.enqueue(json.queue, json.job, json.args)
        jsonRender([success: true])
    }

    def apiFailedCount() {
        jsonRender([count: jesqueFailureService.count])
    }


}
