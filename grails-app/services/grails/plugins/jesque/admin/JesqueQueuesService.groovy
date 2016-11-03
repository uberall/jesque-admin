package grails.plugins.jesque.admin

import net.greghaines.jesque.meta.QueueInfo
import net.greghaines.jesque.meta.dao.QueueInfoDAO

class JesqueQueuesService {

    QueueInfoDAO queueInfoDao

    List<QueueInfo> getQueueInfos(){
        queueInfoDao.queueInfos.sort { it1, it2 -> it1.name <=> it2.name }
    }

    QueueInfo getQueueInfo(def name, offset, max){
        queueInfoDao.getQueueInfo(name, offset, max)
    }

    def getQueueNames(){
        queueInfoDao.queueNames
    }

    def getPendingCount(){
        queueInfoDao.pendingCount
    }

    def getProcessedCount(){
        queueInfoDao.processedCount
    }

    def removeQueue(String name) {
        queueInfoDao.removeQueue(name)
    }

}
