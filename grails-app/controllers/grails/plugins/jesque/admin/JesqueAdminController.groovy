package grails.plugins.jesque.admin

class JesqueAdminController extends AbstractJesqueAdminController {

    def index() {
        render(view: "jesqueAdmin.gsp")
    }

    def overview() {
        jsonRender([
                queues   : queueInfoDao.queueInfos,
                pending  : queueInfoDao.pendingCount,
                processed: queueInfoDao.processedCount,
                workers  : workerInfoDao.allWorkers,
                failed   : failureDao.failQueueJobCount
        ])
    }
}
