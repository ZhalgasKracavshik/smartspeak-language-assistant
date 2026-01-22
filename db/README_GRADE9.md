# Grade 9 Content - Execution Instructions

## 📚 Overview
You now have 3 SQL files with all vocabulary from the Grade 9 English textbook:

1. **grade9_part1_modules_1-3.sql** (~160 words)
   - Module 1: Hobbies & Qualities
   - Module 2: Exercise & Sport  
   - Module 3: Earth & our place on it

2. **grade9_part2_modules_4-6.sql** (~85 words)
   - Module 4: Charities & Conflict
   - Module 5: Traditions & Language
   - Module 6: Reading for Pleasure

3. **grade9_part3_modules_7-9.sql** (~90 words)
   - Module 7: Entertainment & Media
   - Module 8: Travel & Tourism
   - Module 9: Science & Technology

**Total: ~335 words organized by textbook sections (1a, 1c, 1e, etc.)**

---

## 🚀 How to Execute

### Option 1: Supabase SQL Editor (Recommended)

1. Go to your Supabase Dashboard:
   ```
   https://supabase.com/dashboard/project/[your-project-id]/sql
   ```

2. Click "New Query"

3. Copy and paste the contents of **grade9_part1_modules_1-3.sql**

4. Click "Run" (or press Ctrl+Enter)

5. Wait for "Part 1 (Modules 1-3) completed successfully!" message

6. Repeat steps 2-5 for **part2** and **part3**

### Option 2: Using PowerShell Script

Run the provided script:
```powershell
.\db\run_grade9_population.ps1
```

This will guide you through the process and open all files.

---

## ✅ Verification

After running all 3 files, verify in Supabase:

```sql
-- Check total word count
SELECT 
  m.title,
  COUNT(v.id) as word_count
FROM modules m
LEFT JOIN module_vocabulary v ON m.id = v.module_id
WHERE m.grade = 9
GROUP BY m.id, m.title
ORDER BY m.id;
```

Expected results:
- Module 1: ~53 words
- Module 2: ~57 words
- Module 3: ~54 words
- Module 4: ~21 words
- Module 5: ~28 words
- Module 6: ~24 words
- Module 7: ~35 words
- Module 8: ~32 words
- Module 9: ~31 words

**Total: ~335 words**

---

## 📱 Test on Website

1. Go to `/classes` page
2. Click on "Grade 9"
3. Select any module
4. Verify vocabulary shows up with sections (1a, 1c, etc.)
5. Check that Russian and Kazakh translations are present

---

## 🔄 Rollback (if needed)

If something goes wrong, you can delete all vocabulary:

```sql
DELETE FROM module_vocabulary 
WHERE module_id IN (
  SELECT id FROM modules WHERE grade = 9
);
```

Then re-run the files.

---

## 📝 Next Steps

After vocabulary is loaded:
1. Test vocabulary practice features
2. Add grammar rules (optional)
3. Add phrasal verbs (optional)
4. Add practice questions (optional)

Ready to proceed! 🎉
