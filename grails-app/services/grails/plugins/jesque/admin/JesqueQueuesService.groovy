package grails.plugins.jesque.admin

import net.greghaines.jesque.meta.QueueInfo
import net.greghaines.jesque.meta.dao.QueueInfoDAO

class JesqueQueuesService {

    QueueInfoDAO queueInfoDao

    List<QueueInfo> getQueueInfos(){
        queueInfoDao.queueInfos.sort { it1, it2 -> it1.name <=> it2.name }
    }

    QueueInfo getQueueInfo(String name, long offset, long max) {
        queueInfoDao.getQueueInfo(name, offset, max)
    }

    List getQueueNames() {
        queueInfoDao.queueNames
    }

    long getPendingCount() {
        queueInfoDao.pendingCount
    }

    long getProcessedCount() {
        queueInfoDao.processedCount
    }

    void removeQueue(String name) {
        queueInfoDao.removeQueue(name)
    }

}
