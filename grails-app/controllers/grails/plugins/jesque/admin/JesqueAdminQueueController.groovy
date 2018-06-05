package grails.plugins.jesque.admin

import org.springframework.http.HttpStatus

class JesqueAdminQueueController extends AbstractJesqueAdminController {

    def details(String name) {
        def queue = queueInfoDao.getQueueInfo(name, params.getLong('offset', 0), params.getLong('max', 25))
        if (!queue) {
            response.status = HttpStatus.NOT_FOUND.value()
            jsonRender([status: HttpStatus.NOT_FOUND])
        } else {
            jsonRender([queue: queue])
        }
    }

    def remove(String name) {
        queueInfoDao.removeQueue(name)
        jsonRender([success: true])
    }

    def list() {
        jsonRender([queues: queueInfoDao.queueInfos])
    }
}
