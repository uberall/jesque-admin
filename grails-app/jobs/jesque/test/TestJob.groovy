package jesque.test

import org.apache.commons.lang.math.RandomUtils
import org.joda.time.DateTime

class TestJob {

    def jesqueService

    static queue = 'TestJobQueue'

    static triggers = {
        cron queueName: 'TestJobQueue', name: 'TestJobTrigger-1', cronExpression: '0/45 * * * * ? *', args: [1000]
        cron queueName: 'TestJobQueue', name: 'TestJobTrigger-2', cronExpression: '0 */1 * * * ? *', args: [2000]
        cron queueName: 'TestJobQueue', name: 'TestJobTrigger-3', cronExpression: '0 */2 * * * ? *', args: [2000]
        cron queueName: 'TestJobQueue', name: 'TestJobTrigger-4', cronExpression: '0/5 * * * * ? *', args: [3000]
    }

    def perform(int random = RandomUtils.nextInt(2000)) {
        log.warn("sleeping for $random")
        Thread.sleep(random)
        jesqueService.enqueue(queue, TestJob)
        jesqueService.enqueueAt(DateTime.now().plusMillis(random), queue, TestJob, RandomUtils.nextInt(100000))
        jesqueService.enqueueAt(DateTime.now().plusSeconds(random), queue, TestJob, RandomUtils.nextInt(100000))
        jesqueService.enqueueAt(DateTime.now().plusMinutes(random), queue, TestJob, RandomUtils.nextInt(100000))
        jesqueService.enqueueAt(DateTime.now().plusHours(random), queue, TestJob, RandomUtils.nextInt(100000))
        if (random % 100 == 0) {
            throw new Exception("radnom")
        }
    }
}
