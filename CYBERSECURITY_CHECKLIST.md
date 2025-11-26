# Критически важные меры безопасности для SmartSpeak

## ⚠️ Текущие уязвимости

### 1. База данных БЕЗ защиты
- ❌ RLS не применен
- ❌ Любой с URL может читать данные
- ✅ **Решение**: Применить `001_enable_rls_security.sql`

### 2. IP адреса хранятся открыто (нарушение GDPR)
- ❌ Полные IP адреса в БД
- ❌ Могут идентифицировать пользователей
- ✅ **Решение**: Применить `002_enhanced_privacy_security.sql`

### 3. Логи хранятся вечно
- ❌ Нарушение GDPR (макс 90 дней)
- ❌ Риск утечки старых данных
- ✅ **Решение**: Автоудаление в миграции 002

### 4. Нет защиты от перебора паролей
- ❌ Можно бесконечно пытаться войти
- ✅ **Решение**: Rate limiting (уже создан)

### 5. Нет защиты от XSS
- ❌ Пользователи могут вводить HTML/JS
- ✅ **Решение**: Input sanitization (уже создан)

---

## 🔒 Обязательные меры (выполнить СЕЙЧАС)

### Шаг 1: Базовая защита БД (5 минут)
```bash
# В Supabase SQL Editor:
1. Открыть supabase/migrations/001_enable_rls_security.sql
2. Найти строку 171
3. Заменить email на ТВОЙ email или GitHub username
4. Нажать RUN
```

**Для GitHub OAuth:**
```sql
-- Сначала узнай свои данные:
SELECT id, email, raw_user_meta_data 
FROM auth.users 
WHERE email = 'твой@email.com';

-- Затем добавь себя в админы:
INSERT INTO admins (user_id)
SELECT id FROM auth.users 
WHERE raw_user_meta_data->>'preferred_username' = 'твой-github-username';
```

### Шаг 2: Расширенная безопасность (10 минут)
```bash
# В Supabase SQL Editor:
1. Открыть supabase/migrations/002_enhanced_privacy_security.sql
2. Строка 177: заменить GitHub username
3. Строка 180: заменить email
4. Нажать RUN
```

**Что это даст:**
- ✅ IP анонимизируются (192.168.1.xxx → 192.168.1.0)
- ✅ Полные IP хешируются (нельзя обратить)
- ✅ Логи автоудаляются через 90 дней
- ✅ Метаданные шифруются
- ✅ Только админы видят логи

### Шаг 3: Включить Email Verification
```bash
# В Supabase Dashboard:
1. Authentication → Email Auth
2. ✅ Включить "Confirm email"
3. ✅ Включить "Secure email change"
4. Сохранить
```

---

## 🛡️ Дополнительные меры (рекомендуется)

### 1. Настроить сессии безопасно
```bash
# Supabase Dashboard → Authentication → Settings:
- Refresh Token Rotation: ✅ Enable
- Additional Refresh Token Reuse Interval: 10 seconds
- JWT Expiry: 3600 seconds (1 час)
- Refresh Token Lifespan: 604800 seconds (7 дней)
```

### 2. Включить двухфакторную аутентификацию (2FA)
```bash
# Supabase Dashboard → Authentication → Multi-Factor Auth:
1. Enable MFA
2. Require MFA for Admin users
```

### 3. Настроить резервное копирование
```bash
# Supabase Dashboard → Database → Backups:
1. Enable daily backups
2. Retention: 7 days minimum
3. Enable Point-in-Time Recovery (PITR)
```

### 4. Защита от DDoS
```bash
# Supabase Dashboard → Settings → API:
1. Enable Rate Limiting
2. Setup: 100 requests/minute per IP
```

### 5. Мониторинг безопасности
```sql
-- Еженедельно проверяй подозрительную активность:
SELECT 
    anonymized_ip,
    action,
    COUNT(*) as attempt_count,
    MAX(created_at) as last_attempt
FROM security_logs
WHERE action = 'failed_login'
  AND created_at > NOW() - INTERVAL '7 days'
GROUP BY anonymized_ip, action
HAVING COUNT(*) > 5
ORDER BY attempt_count DESC;
```

---

## 📋 Чеклист безопасности перед деплоем

### Критично (БЕЗ этого НЕ деплоить):
- [ ] RLS включен на всех таблицах
- [ ] Админ доступ настроен
- [ ] IP адреса анонимизируются
- [ ] Логи автоудаляются
- [ ] Email verification включен

### Важно:
- [ ] Rate limiting интегрирован
- [ ] Input sanitization добавлен
- [ ] Сессии настроены безопасно
- [ ] Бэкапы включены
- [ ] 2FA для админов

### Рекомендуется:
- [ ] DDoS защита настроена
- [ ] Логи мониторятся еженедельно
- [ ] API ключи ротируются ежемесячно
- [ ] Тестирование на проникновение
- [ ] Security headers настроены

---

## 🚨 Что делать при взломе

### 1. Немедленно:
```bash
1. Заблокировать доступ к БД (Supabase → Pause project)
2. Сменить все API ключи
3. Выйти всех пользователей
4. Проверить логи на подозрительную активность
```

### 2. Расследование:
```sql
-- Проверь последние действия:
SELECT * FROM security_logs 
WHERE created_at > NOW() - INTERVAL '24 hours'
ORDER BY created_at DESC;

-- Проверь новых админов:
SELECT * FROM admins 
WHERE created_at > NOW() - INTERVAL '7 days';
```

### 3. Восстановление:
```bash
1. Restore from last good backup
2. Patch vulnerability
3. Force password reset for all users
4. Notify affected users
```

---

## 📚 Соответствие стандартам

### GDPR (EU):
- ✅ Right to deletion (logs auto-delete)
- ✅ Data minimization (IP anonymization)
- ✅ Encryption at rest
- ✅ Access control (RLS)

### CCPA (California):
- ✅ Right to know (admin can view)
- ✅ Right to delete (manual admin action)
- ✅ No selling of data

### OWASP Top 10:
- ✅ A01:2021 – Broken Access Control → RLS
- ✅ A02:2021 – Cryptographic Failures → Encryption
- ✅ A03:2021 – Injection → Sanitization  
- ✅ A04:2021 – Insecure Design → Security by default
- ✅ A05:2021 – Security Misconfiguration → Hardened
- ✅ A07:2021 – XSS → Input sanitization
- ✅ A08:2021 – Software and Data Integrity → Checksums
- ✅ A09:2021 – Security Logging → Comprehensive logs

---

## 🔐 Ротация секретов

### Ежемесячно:
1. Сменить Supabase API keys
2. Обновить `.env.local` на всех серверах
3. Redeploy приложения

### Ежегодно:
1. Сменить encryption keys в БД
2. Re-encrypt stored data
3. Audit all admin users

---

## Вопросы?

Если нужна помощь - дай знать! Безопасность - это не "поставил и забыл", а постоянный процесс!
