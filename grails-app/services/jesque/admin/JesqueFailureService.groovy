package jesque.admin

import grails.transaction.Transactional
import net.greghaines.jesque.JobFailure
import net.greghaines.jesque.meta.dao.FailureDAO

@Transactional
class JesqueFailureService {

    FailureDAO failureDao

    def requeue(long id) {
        failureDao.requeue(id)
    }

    def remove(long id) {
        failureDao.remove(id)
    }

    def clear() {
        failureDao.clear()
    }

    def getCount() {
        failureDao.count
    }

    List<JobFailure> getFailures(long offset, long max) {
        failureDao.getFailures(offset, max)
    }

}
