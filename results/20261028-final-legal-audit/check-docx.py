from pathlib import Path
import copy, hashlib, json, zipfile, xml.etree.ElementTree as E

p = Path(__file__).resolve().parent
ns = {'w': 'http://schemas.openxmlformats.org/wordprocessingml/2006/main'}
jobs = [
    ('согласие на обработку.docx', 'soglasie-na-obrabotku-personalnyh-dannyh.docx', {
        'word/document.xml': [('Яколвеву', 'Яковлеву')]}),
    ('правила проживания.docx', 'pravila-prozhivaniya.docx', {
        'word/document.xml': [
            ('Парковка, баня, купель и мангал', 'Парковка, баня и мангал'),
            ('Пользование баней и купелью необходимо согласовать заранее; возможность зависит от их доступности и занятости. Услуги оплачиваются отдельно.',
             'Пользование баней необходимо согласовать заранее; возможность зависит от её доступности и занятости. Баня оплачивается отдельно.')]}),
    ('договор офферты.docx', 'dogovor-oferta.docx', {
        'word/document.xml': [('Контактные данные указаны в разделе 15.', 'Контактные данные опубликованы на сайте tangerin.ru.')],
        'word/footer1.xml': [('tangerine.ru', 'tangerin.ru')]})]

result = []
for original, output, changes in jobs:
    src = Path('C:/Users/della/Downloads') / original
    dst = p / '.work/documents' / output
    with zipfile.ZipFile(src) as a, zipfile.ZipFile(dst) as b:
        assert a.testzip() is None and b.testzip() is None
        assert a.namelist() == b.namelist()
        counts = {}
        for name in a.namelist():
            left, right = a.read(name), b.read(name)
            if name not in changes:
                assert left == right, (output, name)
                continue
            expected = E.fromstring(left)
            for before, after in changes[name]:
                nodes = [x for x in expected.findall('.//w:t', ns) if before in (x.text or '')]
                assert len(nodes) == 1, (output, before)
                nodes[0].text = nodes[0].text.replace(before, after)
            assert E.tostring(expected) == E.tostring(E.fromstring(right)), (output, name)
            counts[name] = len(changes[name])
    result.append({'file': output, 'onlyDeclaredTextRunsChanged': counts,
                   'allStylesAndMediaPreserved': True,
                   'originalSha256': hashlib.sha256(src.read_bytes()).hexdigest(),
                   'publishedCopySha256': hashlib.sha256(dst.read_bytes()).hexdigest()})

(p / 'ooxml-checks.json').write_text(json.dumps(result, ensure_ascii=False, indent=2), encoding='utf8')
print('3 DOCX packages valid; exactly 5 declared text changes; all other parts identical')
