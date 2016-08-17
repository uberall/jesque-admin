package grails.plugins.jesque.admin

import org.springframework.http.HttpStatus

class JesqueAdminQueueController extends AbstractJesqueAdminController {

    def details(String name) {
        def queue = jesqueQueuesService.getQueueInfo(name, 0, 1000)
        if(!queue) {
            response.status = HttpStatus.NOT_FOUND.value()
            jsonRender([status: HttpStatus.NOT_FOUND])
        } else {
            jsonRender([queue: queue])
        }
    }

    def remove(String name) {
        jesqueQueuesService.removeQueue(name)
        jsonRender([success: true])
    }

    def list() {
        jsonRender([queues: jesqueQueuesService.queueInfos])
    }
}
