package jesque.admin

import org.springframework.http.HttpStatus

class JesqueAdminQueueController extends AbstractJesqueAdminController {

    def index() {
        def list = jesqueQueuesService.queueInfos
        [list: list.sort { it1, it2 -> it1.name <=> it2.name }]
    }

    def details(String name) {
        def queue = jesqueQueuesService.getQueueInfo(name, 0, 1000)
        if(!queue) {
            response.status = HttpStatus.NOT_FOUND.value()
            jsonRender([status: HttpStatus.NOT_FOUND])
        } else {
            jsonRender([queue: queue])
        }
    }

    def remove() {
        jesqueQueuesService.removeQueue(params.id)
        redirect(controller: 'jesqueManagerQueue', action: 'index')
    }

    def list() {
        jsonRender([queues: jesqueQueuesService.queueInfos])
    }
}
