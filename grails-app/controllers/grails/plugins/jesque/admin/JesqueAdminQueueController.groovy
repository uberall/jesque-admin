package grails.plugins.jesque.admin

class JesqueAdminQueueController extends AbstractJesqueAdminController {

    def details(String name) {
        def queue = queueInfoDao.getQueueInfo(name, params.getLong('offset', 0), params.getLong('max', 25))
        jsonRender([queue: queue])
    }

    def remove(String name) {
        queueInfoDao.removeQueue(name)
        jsonRender([success: true])
    }

    def list() {
        jsonRender([queues: queueInfoDao.queueInfos])
    }
}
