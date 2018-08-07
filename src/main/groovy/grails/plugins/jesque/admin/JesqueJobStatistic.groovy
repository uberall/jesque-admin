package grails.plugins.jesque.admin

import groovy.json.JsonOutput
import net.greghaines.jesque.utils.JesqueUtils

class JesqueJobStatistic {

    String job
    String queue
    Throwable throwable
    String throwableString
    String throwableMessage
    List<String> backtrace
    long start
    long end
    long runtime
    def args
    boolean success

    String asJsonString() {
        /**
         * this hackery is needed, as:
         * - JsonOutput is not able to render some exceptions (causing a stack overflow)
         * - `as JSON` may not be available in some cases during app shutdown
         */
        if (throwable) {
            throwableString = this.throwable.getClass().getName()
            throwableMessage = this.throwable.getMessage()
            backtrace = JesqueUtils.createBacktrace(this.throwable)
        }

        def json = JsonOutput.toJson([
                job             : job,
                queue           : queue,
                start           : start,
                end             : end,
                runtime         : runtime,
                args            : args,
                throwableString : throwableString,
                throwableMessage: throwableMessage,
                backtrace       : backtrace,
                success         : success
        ])

        return json
    }
}
