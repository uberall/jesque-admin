package grails.plugins.jesque.admin

import net.greghaines.jesque.meta.dao.WorkerInfoDAO

class JesqueWorkersService {

    WorkerInfoDAO workerInfoDao

    def getAllWorkers() {
        workerInfoDao.allWorkers
    }

    def getActiveWorkers() {
        workerInfoDao.activeWorkers
    }

    def getWorkerCount() {
        workerInfoDao.workerCount
    }

    def getWorkerHostMap() {
        workerInfoDao.workerHostMap
    }

    def getActiveWorkerCount() {
        workerInfoDao.activeWorkerCount
    }

    def getWorker(String name) {
        workerInfoDao.getWorker(name)
    }

    def removeWorker(String name) {
        workerInfoDao.removeWorker(name)
    }

}
