package grails.plugins.jesque.admin

import net.greghaines.jesque.meta.dao.KeysDAO

class JesqueKeysService {

    KeysDAO keysDao

    def getRedisInfo() {
        keysDao.redisInfo
    }

    def getKeyInfos() {
        keysDao.keyInfos
    }

    def getKeyInfo(String key, long offset, long max) {
        keysDao.getKeyInfo(key, offset, max)
    }
}
