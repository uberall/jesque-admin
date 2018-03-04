package grails.plugins.jesque.admin

import net.greghaines.jesque.meta.WorkerInfo
import net.greghaines.jesque.meta.dao.WorkerInfoDAO

class JesqueWorkersService {

    WorkerInfoDAO workerInfoDao

    List getAllWorkers() {
        workerInfoDao.allWorkers
    }

    List getActiveWorkers() {
        workerInfoDao.activeWorkers
    }

    List getPausedWorkers() {
        workerInfoDao.pausedWorkers
    }

    long getWorkerCount() {
        workerInfoDao.workerCount
    }

    long getActiveWorkerCount() {
        workerInfoDao.activeWorkerCount
    }

    long getPausedWorkerCount() {
        workerInfoDao.pausedWorkerCount
    }

    WorkerInfo getWorker(String name) {
        workerInfoDao.getWorker(name)
    }

    void removeWorker(String name) {
        workerInfoDao.removeWorker(name)
    }

    Map getWorkerHostMap() {
        workerInfoDao.workerHostMap
    }

}
