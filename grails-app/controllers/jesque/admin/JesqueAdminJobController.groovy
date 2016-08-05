package jesque.admin

import grails.converters.JSON
import org.springframework.http.HttpStatus

class JesqueAdminJobController extends AbstractJesqueAdminController {

    private static final BOOLEAN_VALUES = ['true', 'false']

    def index() {
        [jobs: jesqueManagerService.doneJobList]
    }

    def failed() {
        sanitizeParams()
        render([
                list : jesqueFailureService.getFailures(params.getLong("offset"), params.getLong("max")),
                total: jesqueFailureService.count
        ] as JSON)
    }

    def manual() {
        [jobs: QueueConfiguration.jobTypes.keySet().sort()]
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
        [scheduledJobs: jesqueScheduledService.all.sort { it.trigger.nextFireTime.millis }]
    }

    def retryAll() {
        jesqueFailureService.count.times {
            jesqueFailureService.requeue(it)
        }

        redirect(action: 'failed')
    }

    def details() {
        sanitizeParams()
        params.sort = params.sort ?: 'start'
        params.order = params.order ?: 'desc'
        def list = jesqueManagerService.getJobListByName(params.id, params.getInt("max"), params.getInt("offset"), params.sort, params.order)
        [list: list]
    }

    def apiGet(long id) {
        def tempList = jesqueFailureService.getFailures(id, 1)
        def failure = [:]
        if (tempList) {
            failure = tempList.first()
        } else {
            response.status = HttpStatus.NOT_FOUND.value()
        }
        jsonRender([failure: failure])
    }

    def delayed() {
        [jobs: jesqueScheduledService.scheduledJobs]
    }

    def enqueue() {
        def clazz = QueueConfiguration.jobTypes.get(params.jobName)
        def list = []
        params.getList('attrib[]').grep().each { def value ->
            if (value.toString().isNumber()) {
                list.add(value as Long)
            } else if (value instanceof String && value.toLowerCase() in BOOLEAN_VALUES) {
                list.add(value.toBoolean())
            } else
                list.add(value)
        }

        jesqueService.enqueue(QueueConfiguration.getQueueName(clazz), "$params.jobName", list)

        flash.success = true
        render(view: 'manual', model: [selectedJob: params.jobName, jobs: QueueConfiguration.jobTypes.keySet().sort()])
    }

    def apiFailedCount() {
        jsonRender([count: jesqueFailureService.count])
    }

    def apiDeleteTrigger() {
        jesqueScheduledService.delete(params.name)
        jsonRender([success: "OK"])
    }
}
