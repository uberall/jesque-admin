package grails.plugins.jesque.admin

import net.greghaines.jesque.JobFailure
import net.greghaines.jesque.meta.dao.FailureDAO

class JesqueFailureService {

    FailureDAO failureDao

    Date requeue(long id) {
        failureDao.requeue(id)
    }

    void remove(long id) {
        failureDao.remove(id)
    }

    void clear() {
        failureDao.clear()
    }

    long getCount() {
        failureDao.count
    }

    List<JobFailure> getFailures(long offset, long max) {
        failureDao.getFailures(offset, max)
    }

}
