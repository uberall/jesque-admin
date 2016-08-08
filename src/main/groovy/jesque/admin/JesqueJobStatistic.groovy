package jesque.admin

import grails.converters.JSON

class JesqueJobStatistic {

    String job
    String queue
    def throwable
    long start
    long end
    long runtime
    def args
    boolean success


    String asJsonString() {
        ([
                job      : job,
                queue    : queue,
                start    : start,
                end      : end,
                runtime  : runtime,
                args     : args,
                throwable: throwable,
                success  : success
        ] as JSON).toString()
    }
}
