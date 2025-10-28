# 🚀 DC TEKNİK - Gelişmiş Git & Deployment Rehberi
**Versiyon**: v1.7.1  
**Son Güncelleme**: 15 Ocak 2025

---

## 📋 Hızlı Başlangıç

### Tek Komutla Commit:
```bash
npm run commit
```

### Versiyon Güncelle ve Release:
```bash
npm run release:patch
```

### Tam Otomatik Release (Commit + Tag):
```bash
npm run release:commit
```

---

## 🎯 Git İşlemleri

### 1. Akıllı Commit Sistemi

#### Otomatik Commit:
```bash
npm run commit
```
- Tüm değişiklikleri analiz eder
- Uygun commit mesajı oluşturur
- Dosyaları doğrular
- Commit türünü otomatik belirler

#### Manuel Commit Mesajı ile:
```bash
node git-commit.js "Fix login bug"
```

#### Commit Türü Belirtme:
```bash
node git-commit.js --type security "Enhance security"
node git-commit.js --type feature "Add new feature"
node git-commit.js --type fix "Fix bug"
node git-commit.js --type perf "Performance optimization"
```

#### Commit ve Push Birlikte:
```bash
npm run commit:push
# veya
node git-commit.js --push
```

#### Doğrulama Atlama:
```bash
node git-commit.js --no-validate
```

---

### 2. Commit Türleri

| Tür | Açıklama | Örnek |
|-----|----------|-------|
| `feature` | Yeni özellik | "Add dark mode" |
| `fix` | Hata düzeltme | "Fix login bug" |
| `security` | Güvenlik | "Enhance XSS protection" |
| `perf` | Performans | "Optimize image loading" |
| `docs` | Dokümantasyon | "Update README" |
| `refactor` | Kod iyileştirme | "Refactor form validation" |
| `chore` | Bakım | "Update dependencies" |

---

### 3. Git Hooks

#### Pre-Commit Hook
**Dosya**: `.git/hooks/pre-commit`

**Yapılan Kontroller:**
- ✅ Pre-deployment validation
- ✅ Console.log kontrolü
- ✅ Dosya boyutu kontrolü
- ✅ TODO/FIXME uyarıları

**Atlamak için:**
```bash
git commit --no-verify
```

#### Pre-Push Hook
**Dosya**: `.git/hooks/pre-push`

**Yapılan Kontroller:**
- ✅ Full validation
- ✅ Uncommitted changes kontrolü
- ✅ Main branch uyarısı

---

## 📦 Versiyon Yönetimi

### Versiyon Artırma

#### Patch (Hata Düzeltmeleri):
```bash
npm run version:patch
# v1.7.1 → v1.7.2
```

#### Minor (Yeni Özellikler):
```bash
npm run version:minor
# v1.7.1 → v1.8.0
```

#### Major (Büyük Değişiklikler):
```bash
npm run version:major
# v1.7.1 → v2.0.0
```

### Versiyon ile Notlar:
```bash
node version-manager.js patch --notes "Fixed bug" "Added feature"
```

### Mevcut Versiyon:
```bash
node version-manager.js --current
```

**Versiyon Güncelleme Yapılan Dosyalar:**
- `package.json`
- `sw.js` (cache version)
- `index.html` (meta tag)
- `CHANGELOG.md` (otomatik)

---

## 🎉 Release Yönetimi

### Release Oluşturma

#### Basit Release:
```bash
npm run release:patch
```

#### Minor Release:
```bash
npm run release:minor
```

#### Major Release:
```bash
npm run release:major
```

### Release Süreci:
1. ✅ Pre-deployment validation
2. ✅ Version bump
3. ✅ Cache version update
4. ✅ Deployment package creation
5. ✅ Changelog update
6. ✅ Release notes generation

### Otomatik Commit ile Release:
```bash
npm run release:commit
# veya
node release.js patch --commit
```

**Bu Komut:**
- Release sürecini tamamlar
- Git commit yapar
- Git tag oluşturur
- Hazır hale getirir (push manuel)

### Release Notları ile:
```bash
node release.js minor --notes "New feature" "Bug fix" --commit
```

---

## 🔄 Tam Deployment Süreci

### Senaryo 1: Normal Deployment

```bash
# 1. Değişiklikleri yap

# 2. Commit
npm run commit

# 3. Push
git push origin main

# 4. Deploy (Netlify otomatik veya manuel)
```

### Senaryo 2: Release ile Deployment

```bash
# 1. Release oluştur
npm run release:patch --commit

# 2. Push
git push origin main --tags

# 3. Deploy (otomatik veya manuel)
```

### Senaryo 3: Hızlı Hotfix

```bash
# 1. Hızlı commit
npm run commit

# 2. Patch version
npm run version:patch

# 3. Commit ve push
npm run commit:push

# 4. Tag oluştur
git tag -a v1.7.2 -m "Hotfix"
git push origin main --tags
```

---

## 📊 Changelog Sistemi

### Otomatik Changelog

Versiyon güncelleme otomatik olarak `CHANGELOG.md` dosyasını günceller.

**Format:**
```markdown
## [1.7.2] - 2025-01-15

### 🐛 Fixed
- Fixed login bug
- Fixed form validation

### 🔧 Technical
- Version bump to 1.7.2
- Cache version updated
```

### Changelog Manuel Güncelleme

```bash
# Versiyon ile notlar ekle
node version-manager.js patch --notes "Fix bug 1" "Fix bug 2"
```

---

## 🏷️ Git Tagging

### Tag Oluşturma:

```bash
# Mevcut commit için tag
git tag -a v1.7.2 -m "Release v1.7.2"

# Notlar ile tag
git tag -a v1.7.2 -m "Release v1.7.2

- Feature 1
- Fix 1"
```

### Tag Push:

```bash
# Tek tag
git push origin v1.7.2

# Tüm tagler
git push origin main --tags
```

### Otomatik Tag (Release ile):

```bash
npm run release:commit
# Otomatik tag oluşturulur
```

---

## 🔍 Kontrol ve Doğrulama

### Pre-Commit Kontrolleri:

```bash
# Manuel çalıştır
node pre-deploy-check.js
```

**Kontrol Edilenler:**
- ✅ Tüm dosyalar mevcut
- ✅ HTML yapısı geçerli
- ✅ JavaScript hatasız
- ✅ Güvenlik yapılandırmaları
- ✅ Dosya boyutları

### Pre-Push Kontrolleri:

```bash
# Full validation
node pre-deploy-check.js
```

---

## 📝 Commit Mesaj Formatı

### Otomatik Format:

```
<type>: <message>

<detailed description>

Version: v1.7.1
Generated: 2025-01-15T10:30:00.000Z
```

### Manuel Format Önerisi:

```
feat: Add new feature

Detailed description of what was added and why.

Related issues: #123
Version: v1.7.2
```

---

## 🚨 Hata Giderme

### Commit Başarısız:

**Hata**: Pre-commit hook failed
```bash
# Validation hatası düzelt
node pre-deploy-check.js

# Veya hook'u atla (dikkatli!)
git commit --no-verify
```

### Push Başarısız:

**Hata**: Pre-push validation failed
```bash
# Validation düzelt
node pre-deploy-check.js

# Veya hook'u atla
git push --no-verify
```

### Versiyon Çakışması:

**Problem**: Versiyon zaten kullanılmış
```bash
# Mevcut versiyonları kontrol et
git tag -l

# Yeni versiyon seç
node version-manager.js patch
```

---

## 📚 Komut Özeti

### Git İşlemleri:
```bash
npm run commit           # Akıllı commit
npm run commit:push      # Commit + Push
```

### Versiyon:
```bash
npm run version:patch    # Patch versiyon
npm run version:minor    # Minor versiyon
npm run version:major    # Major versiyon
```

### Release:
```bash
npm run release          # Patch release
npm run release:patch    # Patch release
npm run release:minor    # Minor release
npm run release:major    # Major release
npm run release:commit   # Release + commit + tag
```

### Validation:
```bash
npm run validate         # Pre-deployment check
npm run pre-deploy       # Pre-deployment validation
```

---

## 🎯 En İyi Pratikler

### 1. Commit Öncesi:
- ✅ Değişiklikleri test et
- ✅ Validation çalıştır
- ✅ Console.log'ları temizle
- ✅ TODO/FIXME ekleme

### 2. Commit Sırasında:
- ✅ Açıklayıcı commit mesajı kullan
- ✅ İlgili dosyaları commit et
- ✅ Büyük değişiklikleri böl

### 3. Push Öncesi:
- ✅ Pre-push kontrolü geç
- ✅ Testleri çalıştır
- ✅ Main branch'e dikkat et

### 4. Release:
- ✅ CHANGELOG.md kontrol et
- ✅ Version notlarını ekle
- ✅ Tag oluştur
- ✅ Release notes oluştur

---

## 📊 Workflow Özeti

```
Değişiklik Yap
    ↓
npm run commit (validation + commit)
    ↓
npm run version:patch (version bump)
    ↓
npm run release (full release process)
    ↓
git push origin main --tags
    ↓
Deploy
```

---

**Son Güncelleme**: 15 Ocak 2025  
**Versiyon**: v1.7.1  
**Durum**: ✅ **PRODUCTION READY - ENHANCED GIT SYSTEM**

