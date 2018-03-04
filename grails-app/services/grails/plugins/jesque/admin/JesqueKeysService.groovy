package grails.plugins.jesque.admin

import net.greghaines.jesque.meta.KeyInfo
import net.greghaines.jesque.meta.dao.KeysDAO

class JesqueKeysService {

    KeysDAO keysDao

    Map getRedisInfo() {
        keysDao.redisInfo
    }

    List getKeyInfos() {
        keysDao.keyInfos
    }

    KeyInfo getKeyInfo(String key) {
        keysDao.getKeyInfo(key)
    }

    KeyInfo getKeyInfo(String key, int offset, int max) {
        keysDao.getKeyInfo(key, offset, max)
    }

}
