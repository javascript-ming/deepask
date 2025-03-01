/*
 * @Author       : yinming 1090538449@qq.com
 * @Date         : 2025-02-28 14:43
 * @LastEditors  : yinming 1090538449@qq.com
 * @LastEditTime : 2025-02-28 15:00
 * @FilePath     : \deep_seek\configPath.ts
 * @Description  :  
 */
import path from 'path';

export const isProduction = process.env.NODE_ENV === "production";

export const baseDir = isProduction ? path.join(__dirname, "dist") : __dirname;

export const keyPath = path.join(baseDir, "config", "key.pem");

export const certPath = path.join(baseDir, "config", "cert.pem");
