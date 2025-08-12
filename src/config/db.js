// src/config/db.js
import mongoose from 'mongoose'

const cached = (globalThis.__mongoose ||= {conn: null, promise: null})

function mask(uri = '') {
    return uri.replace(/\/\/([^:]+):([^@]+)@/, '//***:***@')
}

function validate(uri) {
    const u = (uri || '').trim()
    if (!u) throw new Error('MONGO_URI is empty')
    if (!/^mongodb(\+srv)?:\/\//.test(u)) {
        throw new Error(`Invalid scheme in MONGO_URI: ${mask(u)}`)
    }
    if (u.startsWith('mongodb+srv://') && /:[0-9]+\//.test(u)) {
        throw new Error(`mongodb+srv URI must NOT include a port: ${mask(u)}`)
    }
    return u
}

export default async function dbConnect() {
    const uri = validate(process.env.MONGO_URI)
    const dbName = process.env.CACHE_PREFIX

    if (cached.conn && mongoose.connection.readyState === 1) return cached.conn
    if (!cached.promise) {
        cached.promise = mongoose
            .connect(uri, {
                dbName,
                serverSelectionTimeoutMS: 5000,
                socketTimeoutMS: 20000,
                maxPoolSize: 10,
                retryWrites: true,
                w: 'majority',
            })
            .then((m) => {
                cached.conn = m
                mongoose.connection.once('disconnected', () => {
                    cached.conn = null
                    cached.promise = null
                })
                mongoose.connection.on('error', () => {
                    cached.conn = null
                    cached.promise = null
                })
                if (process.env.NODE_ENV === 'development') {
                    console.log(`✅ Connected to ${m.connection.db.databaseName}`)
                }
                return m
            })
            .catch((e) => {
                cached.promise = null
                console.error('[DB] connect failed:', e?.message || e)
                throw e
            })
    }
    return cached.promise
}
