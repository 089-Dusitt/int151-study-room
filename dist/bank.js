/* INT151 revision bank. Paraphrased from the course summary and checked API facts. */
(() => {
  'use strict';
  const S = {
    dom: 'Ch01_BasicWebArch_DOM.pdf หน้า 22–54',
    events: 'Ch02-Event.pdf หน้า 6–43',
    storage: '03_ClientStorages.pdf หน้า 11–36',
    javascript: '01_JS_Review.pdf หน้า 4–55',
    submit: 'https://developer.mozilla.org/en-US/docs/Web/API/HTMLFormElement/submit_event',
    stop: 'https://developer.mozilla.org/en-US/docs/Web/API/Event/stopPropagation',
    nodes: 'https://developer.mozilla.org/en-US/docs/Web/API/NodeList',
    remove: 'https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/removeEventListener',
    input: 'https://developer.mozilla.org/en-US/docs/Web/API/Element/input_event',
    cookie: 'https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/Set-Cookie',
    session: 'https://developer.mozilla.org/en-US/docs/Web/API/Window/sessionStorage'
  };
  let factNumber = 0;
  const F = (topic, trap, truth, why, source = S[topic]) => ({ id: `f${++factNumber}`, topic, trap, truth, why, source });
  const facts = [
    F('events', 'Form ใช้ได้เฉพาะ submit รับ click ไม่ได้', 'Form รับ click ได้ด้วย ส่วน submit ใช้ตรวจการส่งฟอร์ม', 'เลือก event ตามสิ่งที่ต้องการตรวจ คลิกช่องกรอกไม่ได้แปลว่าส่งฟอร์ม'),
    F('events', 'submit event ของการส่งฟอร์มเกิดบนปุ่ม submit', 'submit event เกิดที่ form ส่วนปุ่มที่ส่งอาจอ่านผ่าน event.submitter', 'จึงผูก submit listener ที่ form เพื่อครอบคลุมการส่งฟอร์ม'),
    F('events', 'คลิกปุ่ม submit แล้วต้องเกิด submit event เสมอ', 'Native validation ที่ไม่ผ่านอาจหยุดก่อนเกิด submit event', 'เช่น required ว่าง Browser จะตรวจความถูกต้องก่อนส่ง', S.submit),
    F('events', 'กด Enter ในทุกช่องของทุก form แล้วต้อง submit', 'Enter อาจทำให้ส่งฟอร์ม ขึ้นกับชนิดช่องและโครงสร้างฟอร์ม', 'คำว่าเสมอทำให้ข้อความกว้างเกินจริง textarea ใช้ Enter ขึ้นบรรทัดใหม่ได้', S.submit),
    F('events', 'form.submit() กับ form.requestSubmit() เหมือนกันทุกด้าน', 'requestSubmit() ใช้กระบวนการ validation และ submit event ส่วน submit() ข้ามสองอย่างนี้', 'แยกการเรียกเมธอดส่งตรงจากการจำลองการกดปุ่มส่ง', S.submit),
    F('events', 'input.value = "abc" ทำให้ input event เกิดอัตโนมัติ', 'การ assign value ด้วย JavaScript ไม่ยิง input event ให้เอง', 'input ใช้ติดตามการเปลี่ยนค่าจากการโต้ตอบของผู้ใช้ ถ้าจะ dispatch เองต้องสั่งเพิ่ม', S.input),
    F('events', 'input event ของช่องข้อความเกิดก่อนค่าเปลี่ยน', 'input event เกิดหลังผู้ใช้แก้ค่าจึงอ่าน value ใหม่ได้', 'ใช้ทำ preview ขณะพิมพ์ และอย่าสับสนกับ beforeinput', S.input),
    F('events', 'change ของช่องข้อความเกิดทุกครั้งที่พิมพ์หนึ่งตัว', 'ช่องข้อความมักเกิด change เมื่อยืนยันค่าที่แก้ เช่น ออกจากช่องหลังแก้', 'งานแสดงผลตามทุกการแก้ค่าให้เลือก input; change ของ select ใช้เมื่อตกลงเลือกค่า'),
    F('events', 'focus กับ blur bubble ขึ้น ancestor ตามปกติ', 'focus และ blur ไม่ bubble ส่วน focusin และ focusout bubble', 'การไม่ bubble ไม่ได้แปลว่าไม่มีช่วง capture'),
    F('events', 'Event วิ่งไปยัง sibling ทุกตัวในหน้า', 'Event เดินตามเส้นทาง target และ ancestor ของมัน', 'พี่น้องที่ไม่ได้อยู่บนเส้นทางไม่ได้รับ event จาก bubbling ครั้งนั้น'),
    F('events', 'Capture จากลูกขึ้นแม่ ส่วน bubble จากแม่ลงลูก', 'Capture จากนอกเข้าหา target แล้ว bubble จาก target ขึ้นนอก', 'จำทิศเป็น เข้า → ถึง → ออก; บาง event ไม่มี bubbling'),
    F('events', 'target กับ currentTarget เป็น element เดียวกันเสมอ', 'target คือจุดกำเนิดของ event ส่วน currentTarget คือจุดที่ผูก listener ที่กำลังทำงาน', 'กด button ใน div เมื่อ listener ของ div ทำงาน target เป็น button แต่ currentTarget เป็น div'),
    F('events', 'capture: true ทำให้ eventPhase เป็น 1 เสมอ', 'Listener ที่ทำงานบน target อยู่ phase 2 แม้ลงทะเบียน capture: true', 'ค่า phase: 1 capture, 2 at target, 3 bubble; นอกการ dispatch เป็น 0'),
    F('events', 'preventDefault() หยุด bubbling', 'preventDefault() ยกเลิก default action ของ event ที่ยกเลิกได้', 'เช่นป้องกันการส่งฟอร์มหรือการไป URL แต่ propagation ยังเดินต่อ'),
    F('events', 'stopPropagation() ทำให้ link ไม่เปิด URL', 'stopPropagation() หยุด propagation แต่ไม่ได้ยกเลิก default action', 'ถ้าต้องการยกเลิก navigation ให้ใช้ preventDefault()', S.stop),
    F('events', 'stopPropagation() ทำให้บรรทัดถัดไปใน handler ไม่ทำงาน', 'คำสั่งที่เหลือใน handler ยังทำงานหลัง stopPropagation()', 'ถ้าจะจบ handler ต้อง return หรือมีการควบคุมลำดับอื่น', S.stop),
    F('events', 'stopPropagation() หยุด listener อื่นบน element เดียวกันทั้งหมด', 'Listener อื่นบน element เดียวกันยังทำงานได้; stopImmediatePropagation() ใช้หยุด listener ถัดไปด้วย', 'ข้อสอบชอบสลับสองคำสั่งนี้', S.stop),
    F('events', 'addEventListener ต้องใช้ชื่อ "onclick"', 'ใช้ชื่อชนิด event เช่น "click" โดยไม่มี on', 'onclick เป็นชื่อ property ส่วน addEventListener รับ event type'),
    F('events', 'ส่ง handler กับ handler() ให้ addEventListener เหมือนกัน', 'handler ส่งฟังก์ชัน แต่ handler() เรียกทันทีแล้วส่งค่าที่คืนมา', 'ถ้าอยากให้เรียกเมื่อคลิก ต้องส่ง function reference'),
    F('events', 'Arrow function ถอดออกด้วย removeEventListener ไม่ได้', 'Arrow function ถอดได้เมื่อใช้ function reference ตัวเดิมและ capture ตรงกัน', 'เก็บ const handler = () => {} แล้วใช้ handler ทั้งเพิ่มและถอด', S.remove),
    F('events', 'เขียน anonymous function ใหม่ที่โค้ดเหมือนเดิมใช้ถอด listener ได้', 'ฟังก์ชันที่สร้างใหม่เป็นคนละ object จึงไม่ตรง listener เดิม', 'เทียบตัวฟังก์ชัน ไม่ได้เทียบข้อความภายในฟังก์ชัน', S.remove),
    F('events', 'removeEventListener ไม่สนใจ capture ที่ใช้ตอนเพิ่ม', 'การถอดต้องตรง element, type, function reference และ capture', 'ตัวเลือกอย่าง passive ไม่ใช่เกณฑ์ matching ตัวสำคัญแบบ capture', S.remove),
    F('events', 'assign onclick หลายครั้งทำให้สะสม handler ทุกอัน', 'assign onclick ใหม่จะแทนค่า property เดิม ส่วน addEventListener รองรับหลาย listener', 'แต่เพิ่ม type/function/capture ชุดเดิมซ้ำไม่ได้เพิ่มสำเนา listener'),
    F('events', 'Event delegation ต้องผูก listener ใหม่ให้ลูกที่เพิ่มทีหลังทุกครั้ง', 'ผูกที่ parent แล้วใช้ event target กรองลูกได้ รวมถึงลูกที่เพิ่มทีหลัง', 'ใช้ event ที่ bubble และตรวจ matches/closest เพื่อไม่รับคลิกที่ไม่เกี่ยวข้อง'),
    F('events', 'DOMContentLoaded ต้องรอรูปภาพทุกภาพโหลดเสร็จ', 'DOMContentLoaded ใช้เมื่อเอกสาร HTML parse พร้อมและสคริปต์ deferred ที่เกี่ยวข้องเสร็จ โดยไม่รอรูปภาพทั้งหมด', 'load ของ window ใช้รอหน้าและทรัพยากรที่เกี่ยวข้องโหลดเสร็จ'),
    F('dom', 'getElementById("#menu") เลือก id="menu" ได้', 'getElementById("menu") รับชื่อ id โดยไม่มี #', '# เป็น syntax ของ CSS selector สำหรับ querySelector'),
    F('dom', 'querySelector() คืน element ที่ตรงทุกตัว', 'querySelector() คืน element แรกที่ตรง หรือ null', 'ถ้าอยากได้ทุกรายการใช้ querySelectorAll()'),
    F('dom', 'querySelectorAll() ไม่พบอะไรแล้วคืน null', 'querySelectorAll() คืน NodeList ว่าง ความยาว 0', 'แยกหา element เดียวไม่พบกับหาเป็นรายการว่าง'),
    F('dom', 'NodeList คือ Array จึงเรียก map() ได้ตรง ๆ', 'NodeList ไม่ใช่ Array แต่มี forEach; ใช้ Array.from(list) ก่อนใช้ Array methods', 'การมี length และ index ไม่ได้ทำให้ชนิดข้อมูลเป็น Array', S.nodes),
    F('dom', 'NodeList ทุกอันเป็น static', 'querySelectorAll() คืน static NodeList แต่ childNodes เป็น live NodeList', 'ต้องดู API ที่สร้าง collection นั้น ไม่ตัดสินจากคำว่า NodeList อย่างเดียว', S.nodes),
    F('dom', 'getElementsByClassName() เป็น snapshot ที่ไม่เปลี่ยนตาม DOM', 'getElementsByClassName() คืน live HTMLCollection', 'เพิ่มหรือลบ element ที่ตรง class แล้ว collection ที่เก็บไว้เปลี่ยนตาม'),
    F('dom', 'children กับ childNodes รวม node ชนิดเดียวกัน', 'children มีเฉพาะ Element ส่วน childNodes รวม Text และ Comment ด้วย', 'ช่องว่างและขึ้นบรรทัดระหว่างแท็กอาจเป็น Text node'),
    F('dom', 'firstChild ต้องเป็น HTML element', 'firstChild อาจเป็น Text หรือ Comment; firstElementChild เลือกเฉพาะ Element', 'ถ้ามีช่องว่างก่อนแท็กลูก ตัวแรกอาจเป็น Text node'),
    F('dom', 'document.firstChild ต้องเป็น html เสมอ', 'เมื่อมี doctype โหนดแรกของ document อาจเป็น DocumentType', 'ถ้าอยากได้ root element ใช้ document.documentElement'),
    F('dom', 'appendChild(existingNode) คือ copy โหนดนั้น', 'appendChild(existingNode) ย้ายโหนดเดิมไปตำแหน่งใหม่', 'โหนดเดียวไม่อยู่สอง parent พร้อมกัน ถ้าจะ copy ใช้ cloneNode ตามความต้องการ'),
    F('dom', 'textContent = "<b>Hi</b>" ทำให้ Hi ตัวหนา', 'textContent ตั้งข้อความตามตัวอักษร ส่วน innerHTML parse HTML', 'เวลาตั้งข้อความผู้ใช้ให้ใช้ textContent เพื่อไม่ตีความเป็น markup'),
    F('dom', 'อ่านข้อความที่พิมพ์ล่าสุดใน input ด้วย textContent', 'อ่านค่าปัจจุบันของ input ด้วย .value', 'ข้อความใน element อย่าง p ใช้ textContent; คนละคุณสมบัติกับช่องกรอก'),
    F('dom', 'checkbox.value บอกว่าถูกติ๊กหรือไม่', 'checkbox.checked เป็น boolean ที่บอกสถานะติ๊กปัจจุบัน', 'value คือค่าที่สัมพันธ์กับ checkbox ไม่ใช่สถานะเลือก'),
    F('dom', 'data-product-id="10" อ่านด้วย dataset.product-id', 'อ่านด้วย dataset.productId และได้ string "10"', 'dash ในชื่อ data attribute แปลงเป็น camelCase ใน dataset'),
    F('dom', 'classList.toggle("open") เพิ่ม class เท่านั้น', 'toggle เอาออกเมื่อมี และเพิ่มเมื่อไม่มี; toggle(name, true) บังคับให้มี', 'contains() ตรวจ, add() เพิ่ม, remove() ลบ โดยไม่ต้องเขียน className ทั้งก้อน'),
    F('dom', 'closest() ค้นเฉพาะลูกหลานของ element', 'closest() ตรวจตัว element เองก่อน แล้วไล่ ancestor ขึ้นไป', 'คืน element ที่ตรงใกล้ที่สุด หรือ null; matches() ตรวจแค่ตัวเอง'),
    F('dom', 'parent.removeChild(node) ลบ descendant ใดก็ได้ทุกชั้น', 'removeChild() ต้องรับลูกโดยตรงของ parent นั้น ส่วน element.remove() เอาตัวเองออก', 'ถ้าส่งหลานที่ไม่ใช่ลูกตรงให้ removeChild จะเกิดข้อผิดพลาด'),
    F('storage', 'setItem("count", 1) แล้ว getItem คืน number 1', 'Web Storage เก็บ key/value เป็น string จึงอ่านกลับได้ "1"', 'แปลงด้วย Number ก่อนบวก ไม่เช่นนั้น "1" + 1 ได้ "11"'),
    F('storage', 'getItem() ไม่พบ key แล้วคืน undefined', 'getItem() คืน null เมื่อไม่มี key นั้น', 'เทียบกับ array.find() ที่ไม่พบคืน undefined ให้แม่น'),
    F('storage', 'เก็บ object ตรง ๆ ด้วย setItem แล้วได้ object กลับ', 'ใช้ JSON.stringify ก่อนเก็บ และ JSON.parse หลังอ่านเพื่อคืนโครงสร้างข้อมูล', 'การเก็บ object ธรรมดาตรง ๆ มักได้ string "[object Object]"'),
    F('storage', 'แก้ object ที่ JSON.parse มาแล้ว Storage เปลี่ยนตามเอง', 'หลังแก้ข้อมูลในหน่วยความจำ ต้อง setItem บันทึกใหม่', 'ค่าที่ parse แล้วกับข้อความที่อยู่ใน Storage ไม่ใช่ข้อมูลที่ผูกให้ sync อัตโนมัติ'),
    F('storage', 'Refresh แท็บเดิมทำให้ sessionStorage หายทันที', 'sessionStorage อยู่ข้าม reload ภายใน page session ของแท็บเดิม', 'แยก refresh ออกจากการจบ page session', S.session),
    F('storage', 'สลับไปมาระหว่างแท็บลบ sessionStorage ของแท็บเดิม', 'การสลับแท็บไม่ได้ลบข้อมูล แต่แต่ละแท็บมี page session แยกกัน', 'แท็บที่มี opener อาจเริ่มจากสำเนาข้อมูล opener แต่หลังจากนั้นแยกกัน', S.session),
    F('storage', 'localStorage ของทุกเว็บไซต์ใช้พื้นที่ key ร่วมกัน', 'localStorage แยกตาม origin คือ scheme, host และ port', 'http://site.test กับ https://site.test เป็นคนละ origin'),
    F('storage', 'localStorage มีตัวเลือก expiry ใน setItem()', 'localStorage ไม่มี expiry ในตัว API; ถ้าต้องหมดอายุต้องเขียนเงื่อนไขเอง', 'โดยทั่วไปอยู่ข้ามการปิดเปิด browser จนลบ ผู้ใช้หรือ browser policy อาจลบได้'),
    F('storage', 'localStorage แนบไป server อัตโนมัติทุก request', 'Web Storage ไม่ถูกแนบเป็น HTTP Cookie header อัตโนมัติ', 'JavaScript ยังอ่านค่าแล้วส่งด้วย request เองได้ จึงไม่ใช่ส่ง server ไม่ได้เลย'),
    F('storage', 'localStorage.clear() ลบ Cookie และ sessionStorage ด้วย', 'clear() ล้าง key ของ storage object ที่เรียกในพื้นที่นั้น', 'removeItem(key) ลบ key เดียว; clear() ไม่ข้ามไป storage ชนิดอื่น'),
    F('storage', 'JSON.parse() แปลง JS object ให้เป็น JSON string', 'stringify: JS value → JSON string; parse: JSON string → JS value', 'หลัง parse array แล้วจึงเรียก map/filter/reduce กับมันได้'),
    F('storage', 'JSON.parse() รับ string รูปแบบใดก็ได้โดยไม่ error', 'JSON ที่ผิดรูปแบบทำให้ JSON.parse throw SyntaxError', 'ใช้ try/catch เมื่อต้องรองรับข้อมูลเก่าที่เสียหรือผู้ใช้แก้ข้อมูล'),
    F('storage', 'Cookie ทุกตัวถูกส่งไปทุก URL', 'การส่ง Cookie ขึ้นกับ domain, path, expiry, Secure และนโยบายที่เกี่ยวข้อง', 'โจทย์ URL ต้องตรวจเงื่อนไขให้ครบ ไม่ใช่เห็นชื่อ host คล้ายกันแล้วเลือกทันที'),
    F('storage', 'ไม่ระบุ Domain แล้ว Cookie ใช้ได้กับ subdomain ทุกตัว', 'เมื่อไม่ระบุ Domain จะเป็น host-only สำหรับ host ที่ตั้ง', 'Domain=example.com จึงครอบคลุม example.com และ subdomain ที่ตรงเงื่อนไข', S.cookie),
    F('storage', 'Cookie Path=/shop ครอบคลุม /shopping', 'Path=/shop ตรงกับ /shop และ /shop/cart แต่ไม่ใช่ /shopping', 'ต้องตรงขอบเขตเส้นทาง ไม่ใช่แค่ขึ้นต้นด้วยตัวอักษรเหมือนกัน', S.cookie),
    F('storage', 'Cookie path ตรงก็ส่งได้ แม้ domain คนละเว็บไซต์', 'Domain และ Path ต้องผ่านพร้อมกัน', 'path=/account ที่ example.com ไม่ทำให้ Cookie ไป unrelated.test/account'),
    F('storage', 'Secure ทำให้ document.cookie อ่าน Cookie ไม่ได้', 'Secure คุมการส่งผ่าน HTTPS ส่วน HttpOnly กันการเข้าถึงจาก JavaScript', 'สอง flag ทำคนละงานและใช้ร่วมกันได้; localhost มีข้อยกเว้น Secure ใน browser', S.cookie),
    F('storage', 'ตั้ง HttpOnly ผ่าน document.cookie ได้', 'HttpOnly ต้องตั้งผ่าน Set-Cookie จาก server', 'Browser ยังเก็บ Cookie นี้และส่งตามเงื่อนไข แต่ JS อ่านผ่าน document.cookie ไม่ได้', S.cookie),
    F('storage', 'Max-Age ใช้หน่วยมิลลิวินาทีเหมือน Date.now()', 'Max-Age ใช้วินาที ส่วน timestamp ของ Date ใช้มิลลิวินาที', 'หนึ่งชั่วโมงคือ Max-Age=3600 หรือ Date.now() + 3600000'),
    F('storage', 'ถ้าตั้ง Expires กับ Max-Age พร้อมกัน Expires ชนะ', 'เมื่อมีทั้งสอง attribute Max-Age มีลำดับความสำคัญเหนือ Expires', 'Max-Age=0 หรือค่าติดลบใช้ทำให้หมดอายุได้', S.cookie),
    F('storage', 'assign document.cookie ใหม่ล้าง Cookie เดิมทั้งหมด', 'แต่ละการ assign ตั้งหรือแก้ Cookie หนึ่งคู่ตามชื่อและ scope', 'Cookie ชื่ออื่นยังอยู่; ชื่อเดียวกันแต่ path ต่างกันสามารถมีร่วมกันได้'),
    F('storage', 'document.cookie getter คืน flag อย่าง HttpOnly และ Path มาด้วย', 'getter คืน string ของคู่ name=value ที่ JS เข้าถึงได้ ไม่คืน attributes', 'ถ้าไม่มี Cookie ที่เข้าถึงได้จะได้ string ว่าง ไม่ใช่ null'),
    F('storage', 'ตั้ง Cookie เป็นค่าว่างคือการลบแน่นอน', 'การลบต้องทำให้ Cookie หมดอายุและใช้ชื่อ/domain/path ที่ตรง Cookie เดิม', 'ค่าว่างอย่างเดียวอาจเป็น Cookie ที่ยังมีอยู่'),
    F('storage', 'encodeURIComponent() เข้ารหัสให้ Cookie เป็นความลับ', 'encodeURIComponent() เป็น percent-encoding ไม่ใช่ encryption', 'ใช้จัดรูปแบบอักขระพิเศษ ไม่ใช่ป้องกันผู้อื่นอ่านข้อความ'),
    F('storage', 'Session Cookie กับ sessionStorage มีขอบเขตแท็บเหมือนกัน', 'Session Cookie เกี่ยวกับ browser session ส่วน sessionStorage แยก page session ตามแท็บ', 'Browser session restore อาจคืน session cookies ได้ จึงอย่าเหมาว่าปิดแล้วหายทุกกรณี'),
    F('javascript', 'const ห้ามแก้ property ของ object และสมาชิก array', 'const ห้ามเปลี่ยน binding แต่แก้เนื้อหา object/array ที่อ้างอยู่ได้', 'const user = {}; user.name = "Ann" ได้ แต่ user = {} ใหม่ไม่ได้'),
    F('javascript', 'typeof [] ได้ "array"', 'typeof [] ได้ "object"; ตรวจ array ด้วย Array.isArray()', 'Array เป็น object ชนิดหนึ่งใน JavaScript'),
    F('javascript', 'Array ว่างและ object ว่างเป็น falsy', '[] และ {} เป็น truthy', 'ค่าที่ falsy เช่น false, 0, "", null, undefined, NaN; "false" เป็น string ไม่ว่างจึง truthy'),
    F('javascript', '"5" + 1 ได้ number 6', '"5" + 1 ได้ string "51"; Number("5") + 1 ได้ 6', 'operator + ใช้ต่อข้อความได้ จึงต้องดูชนิดค่าจาก input และ Storage'),
    F('javascript', '"5" === 5 เป็น true เพราะค่าหน้าตาเหมือนกัน', '=== ไม่แปลงชนิด จึงได้ false', 'switch เปรียบเทียบ case ด้วย strict equality เช่นกัน'),
    F('javascript', 'ฟังก์ชันไม่มี return จะได้ null', 'ฟังก์ชันที่จบโดยไม่คืนค่าได้ undefined', 'console.log() แสดงผลแต่ไม่ได้ทำให้ฟังก์ชันคืนค่าที่แสดง'),
    F('javascript', 'x => { x * 2 } คืนผลคูณเหมือน x => x * 2', 'Arrow แบบมี block ต้องเขียน return จึงคืนผลคูณ', 'ปีกกาที่เป็น function body ไม่ได้ implicit return'),
    F('javascript', 'forEach() คืน array ใหม่เหมือน map()', 'forEach() คืน undefined ส่วน map() คืน array ใหม่', 'ใช้ forEach เมื่อต้องทำผลข้างเคียง ใช้ map เมื่อต้องแปลงสมาชิก'),
    F('javascript', 'find() กับ filter() คืน array เหมือนกัน', 'find() คืนสมาชิกแรกหรือ undefined; filter() คืน array ที่ผ่านเงื่อนไข', 'filter ไม่พบได้ [] ไม่ใช่ null หรือ undefined'),
    F('javascript', 'push() คืน array ใหม่ ส่วน pop() คืนความยาว', 'push() แก้ array เดิมและคืนความยาวใหม่; pop() คืนสมาชิกที่เอาออก', 'pop จาก array ว่างคืน undefined'),
    F('javascript', 'for...of วน key และ for...in วนค่า', 'for...of วนค่าของ iterable; for...in วนชื่อ property ที่ enumerable', 'for...in อาจรวม inherited properties จึงอย่าใช้แทนการวนค่า array อย่างไม่คิด'),
    F('javascript', 'while และ do...while ทำ body อย่างน้อยหนึ่งครั้งเหมือนกัน', 'while อาจไม่ทำเลย แต่ do...while ทำ body อย่างน้อยหนึ่งครั้งเมื่อเข้า statement', 'ต่างกันที่ตรวจ condition ก่อนหรือหลัง body'),
    F('javascript', 'break และ continue ออกจาก loop เหมือนกัน', 'break ออกจาก loop ส่วน continue ข้ามส่วนที่เหลือของรอบปัจจุบัน', 'return ออกจากฟังก์ชัน เป็นอีกคำสั่งหนึ่ง'),
    F('javascript', 'Object สองก้อนข้อมูลเหมือนกันจึง === กัน', 'Object ใช้ reference ในการเปรียบเทียบ ไม่ได้เทียบทุก property อัตโนมัติ', '{} === {} เป็น false แต่ const b = a ทำให้ a === b'),
    F('javascript', 'Spread ทำ deep copy ของ object ซ้อนทุกชั้น', 'Spread เป็น shallow copy; object ที่ซ้อนยังอาจอ้างตัวเดิม', 'เปลี่ยน nested object ผ่านสำเนาอาจกระทบต้นฉบับ'),
    F('javascript', 'Destructuring default ใช้แทน null ด้วย', 'Destructuring default ใช้เมื่อค่าเป็น undefined หรือไม่มี property', 'const {x = 1} = {x: null} ให้ x เป็น null; ถ้าจะรองรับ null ใช้ ??'),
    F('javascript', 'Date.now() ใช้วินาที และ getMonth() เริ่ม 1', 'Date.now() เป็น timestamp มิลลิวินาที ส่วน getMonth() คืน 0–11', 'getDate() คือวันที่ในเดือน; getDay() คือวันในสัปดาห์ 0–6'),
    F('javascript', 'prompt() กด OK ไม่พิมพ์อะไรแล้วได้ null', 'prompt() กด OK ค่าว่างได้ "" ส่วนกด Cancel ได้ null', 'confirm() คืน boolean; alert() คืน undefined'),
    F('javascript', '/\\d{3}/ บังคับให้ทั้งข้อความมีเลขเพียงสามหลัก', '/\\d{3}/ หาเลขติดกันสามหลักได้ภายในข้อความ; /^\\d{3}$/ จึงบังคับทั้งข้อความ', '^ คือเริ่มข้อความ และ $ คือท้ายข้อความ เมื่อไม่ใช้ multiline flag'),
    F('javascript', 'ไฟล์ .js ทุกไฟล์ใน Browser เป็น ES module อัตโนมัติ', 'โหลดด้วย script type="module" หรือ import จาก module เพื่อใช้ ES module', 'Named import ใช้ชื่อ export หรือ alias ส่วน default import ตั้งชื่อฝั่งรับได้'),
    F('javascript', 'อ่าน property ที่ไม่มีใน object แล้วได้ null', 'การอ่าน property ที่หาไม่พบทั้งใน object และ prototype chain ได้ undefined', 'เช่น const obj = {}; obj.missing ได้ undefined ต่างจาก getItem() ที่ไม่พบคืน null')
  ];

  let questionNumber = 0;
  const O = (text, correct, why) => ({ text, correct, why });
  const Q = (topic, stem, thai, options, code = '', source = S[topic]) => ({ id: `q${++questionNumber}`, topic, stem, thai, code, options, source });
  const questions = [
    Q('events', 'Select all correct statements about a form.', 'เลือกทุกข้อความที่ถูกเกี่ยวกับ form', [
      O('A form can have a click listener.', true, 'form เป็น EventTarget และรับ click ได้'),
      O('A normal form submission fires submit on the submit button.', false, 'submit event เกิดที่ form'),
      O('A form can have a submit listener.', true, 'ใช้ตรวจการส่งฟอร์ม'),
      O('Every click inside a form submits it.', false, 'คลิกช่องกรอกหรือพื้นที่ว่างไม่ได้ส่งฟอร์มทุกครั้ง')
    ]),
    Q('events', 'Select all correct statements about submitting a form.', 'เลือกข้อที่ถูกเกี่ยวกับการส่งฟอร์ม', [
      O('Native validation can prevent a submit event.', true, 'ไม่ผ่าน validation อาจถูกหยุดก่อน submit event'),
      O('form.submit() performs validation and fires submit.', false, 'เมธอดนี้ข้าม validation และ submit event'),
      O('form.requestSubmit() follows the validation and submit-event process.', true, 'ทำกระบวนการเช่นการกดปุ่มส่ง'),
      O('Pressing Enter in any form control always submits the form.', false, 'ขึ้นกับ control และโครงสร้างของ form')
    ], '', S.submit),
    Q('events', 'A click listener is on the div. The button is clicked. Select all correct statements.', 'ผูก click listener ที่ div แล้วคลิก button ข้างใน เลือกทุกข้อที่ถูก', [
      O('event.target is the button.', true, 'ในโครงสร้างนี้ button คือจุดที่คลิก'),
      O('event.currentTarget is the div.', true, 'listener ที่กำลังทำงานผูกกับ div'),
      O('event.type changes from click to submit at the div.', false, 'event type ไม่เปลี่ยนระหว่าง bubbling'),
      O('event.target is the div because its listener is running.', false, 'สลับความหมาย target กับ currentTarget')
    ], '<div id="box"><button id="save">Save</button></div>'),
    Q('events', 'Select all correct statements about event phases.', 'เลือกทุกข้อที่ถูกเกี่ยวกับ phase', [
      O('Capturing travels from outer ancestors toward the target.', true, 'capture เข้าใกล้ target'),
      O('The at-target phase has eventPhase 2.', true, '1 capture, 2 target, 3 bubble'),
      O('A capture listener running on the target must report phase 1.', false, 'ที่ target เป็น phase 2'),
      O('Bubbling travels through all siblings before the parent.', false, 'เดินตาม ancestor ไม่แวะ sibling')
    ]),
    Q('events', 'Select all correct statements about preventDefault().', 'เลือกทุกข้อที่ถูกเกี่ยวกับ preventDefault()', [
      O('It can cancel a cancelable default action.', true, 'ต้องเป็น event ที่ยกเลิก default ได้และไม่ได้อยู่ใน passive listener'),
      O('It automatically stops bubbling.', false, 'propagation เป็นอีกกลไกหนึ่ง'),
      O('It automatically returns from the current handler.', false, 'โค้ดถัดไปใน handler ยังทำงาน'),
      O('It removes the current listener.', false, 'ไม่ได้ถอด listener')
    ]),
    Q('events', 'Select all correct statements about stopPropagation().', 'เลือกทุกข้อที่ถูกเกี่ยวกับ stopPropagation()', [
      O('It stops the event from propagating further.', true, 'หยุดการเดินต่อของ event'),
      O('It automatically cancels link navigation.', false, 'default action ต้องใช้ preventDefault'),
      O('Statements after the call can still run.', true, 'ไม่ใช่ return'),
      O('Other listeners on the same element can still run.', true, 'ถ้าจะหยุด listener ถัดไปด้วยใช้ stopImmediatePropagation')
    ], '', S.stop),
    Q('events', 'button is an element and handler is a function. Select all correct statements.', 'สมมติ button เป็น element และ handler เป็นฟังก์ชัน เลือกทุกข้อที่ถูก', [
      O('handler is invoked immediately during this statement.', false, 'ส่ง reference จึงยังไม่เรียกจากบรรทัดนี้'),
      O('The event type is click, without an on prefix.', true, 'onclick เป็น property ไม่ใช่ type ที่ต้องการ'),
      O('The browser can pass an event object to handler when a click is dispatched.', true, 'callback รับ Event object'),
      O('Changing handler to handler() would invoke the function immediately.', true, 'parentheses คือการเรียกฟังก์ชัน')
    ], 'button.addEventListener("click", handler);'),
    Q('events', 'Select all correct ways to remove the registered listener.', 'เลือกทุกวิธีที่ถอด listener ที่ลงทะเบียนนี้ได้จริง', [
      O('button.removeEventListener("click", handler, true)', true, 'type/function/capture ตรงเดิม'),
      O('button.removeEventListener("click", handler, { capture: true })', true, 'รูปแบบ options แต่ capture ตรง'),
      O('button.removeEventListener("click", handler, false)', false, 'capture ไม่ตรง'),
      O('button.removeEventListener("click", () => {}, true)', false, 'คนละ function reference')
    ], `const handler = () => {};
button.addEventListener("click", handler, true);`, S.remove),
    Q('events', 'Select all correct statements about text input events.', 'เลือกข้อที่ถูกเกี่ยวกับ event ของช่องข้อความ', [
      O('The input event is useful for a preview while the user edits text.', true, 'ติดตามค่าขณะผู้ใช้เปลี่ยน'),
      O('Setting input.value with JavaScript automatically dispatches input.', false, 'assign ไม่ยิง event ให้อัตโนมัติ'),
      O('The current text can be read through input.value.', true, 'value คือค่าช่องกรอกปัจจุบัน'),
      O('change must fire after every typed character.', false, 'ช่องข้อความใช้ input สำหรับทุกการแก้ค่า')
    ], '', S.input),
    Q('events', 'Select all correct statements about delegation.', 'เลือกข้อที่ถูกเกี่ยวกับ event delegation', [
      O('A parent listener can handle bubbled clicks from new descendants.', true, 'ลูกที่เพิ่มทีหลังใช้ parent listener เดิมได้'),
      O('The handler should check which descendant was activated.', true, 'กรอง target เพื่อไม่ตอบสนองต่อพื้นที่หรือปุ่มที่ไม่เกี่ยวข้อง'),
      O('Delegation changes event.target to the parent.', false, 'currentTarget เป็น parent แต่ target ไม่ถูกเปลี่ยนเพราะ delegation'),
      O('Delegation requires a separate click listener on every child.', false, 'จุดประสงค์คือใช้ listener รวมที่ parent')
    ]),
    Q('events', 'Select all correct statements about load and focus.', 'เลือกข้อที่ถูกเกี่ยวกับ load และ focus', [
      O('DOMContentLoaded does not wait for every image to finish loading.', true, 'เหตุการณ์นี้เกี่ยวกับ HTML/DOM ที่พร้อม'),
      O('A window load event is useful when waiting for page resources.', true, 'รอหน้าและทรัพยากรที่เกี่ยวข้อง'),
      O('focus and blur bubble just like focusin and focusout.', false, 'focus/blur ไม่ bubble'),
      O('A non-bubbling event cannot have a capturing phase.', false, 'ไม่ bubble ไม่เท่ากับไม่มี capture')
    ]),
    Q('events', 'button is an element; first and second are different functions. Select all correct statements.', 'สมมติ button เป็น element และ first/second เป็นคนละฟังก์ชัน เลือกทุกข้อที่ถูกเกี่ยวกับการกำหนด onclick', [
      O('The second assignment replaces the onclick property value.', true, 'property เก็บค่าใหม่แทนค่าเดิม'),
      O('Both functions are accumulated by these assignments.', false, 'นี่ไม่ใช่ addEventListener สองครั้ง'),
      O('The first function is guaranteed to run before the second on each click.', false, 'property สุดท้ายคือ second'),
      O('onclick is the same property mechanism as addEventListener.', false, 'คนละวิธีลงทะเบียน จึงมีพฤติกรรมการแทนค่าต่างกัน')
    ], `button.onclick = first;
button.onclick = second;`),
    Q('dom', 'Select all correct statements about DOM selection.', 'เลือกทุกข้อความที่ถูกเกี่ยวกับการเลือก DOM', [
      O('getElementById("menu") selects an element with id="menu".', true, 'ส่งชื่อ id โดยไม่ใส่ #'),
      O('querySelector(".item") returns the first match or null.', true, 'คืนหนึ่ง element'),
      O('querySelectorAll(".item") returns null if no elements match.', false, 'คืน NodeList ว่าง'),
      O('getElementById requires a CSS selector beginning with #.', false, 'API นี้รับชื่อ id ตรง ๆ')
    ]),
    Q('dom', 'Initially there is one .item. A second is appended. Select all correct statements.', 'เริ่มต้นมี .item หนึ่งตัว แล้วเพิ่มอีกตัว เลือกทุกข้อที่ถูก', [
      O('snapshot.length is still 1.', true, 'querySelectorAll เป็น static'),
      O('live.length becomes 2.', true, 'getElementsByClassName เป็น live'),
      O('snapshot.length automatically becomes 2.', false, 'snapshot ไม่เพิ่มสมาชิกตาม DOM'),
      O('Both collections must be queried again to include the new element.', false, 'live เปลี่ยนตามอยู่แล้ว')
    ], `const snapshot = document.querySelectorAll(".item");
const live = document.getElementsByClassName("item");
// append a second element with class="item"`),
    Q('dom', 'Select all correct statements about nodes.', 'เลือกข้อที่ถูกเกี่ยวกับ node', [
      O('childNodes can contain Text nodes.', true, 'รวมชนิด node ไม่จำกัดแค่ Element'),
      O('children contains only Element children.', true, 'แยก children จาก childNodes'),
      O('Whitespace between tags can produce Text nodes.', true, 'ทำให้จำนวน childNodes มากกว่าจำนวนแท็ก'),
      O('firstChild must be an Element.', false, 'อาจเป็น Text หรือ Comment')
    ]),
    Q('dom', 'Select all correct statements about NodeList.', 'เลือกทุกข้อที่ถูกเกี่ยวกับ NodeList', [
      O('Every NodeList is static.', false, 'childNodes เป็นตัวอย่าง live NodeList'),
      O('A NodeList is an Array.', false, 'เป็นคนละชนิด'),
      O('Array.from(nodeList) can create an Array.', true, 'แล้วใช้ Array methods ได้'),
      O('querySelectorAll() returns a static NodeList.', true, 'snapshot ของรายการเมื่อ query')
    ], '', S.nodes),
    Q('dom', 'listA and listB are sibling ul elements. listA has an li child. Select all correct statements after this code.', 'listA และ listB เป็น ul ที่มี parent เดียวกัน โดย listA มีลูก li เลือกทุกข้อที่ถูกหลังโค้ดทำงาน', [
      O('The existing node is moved to listB.', true, 'appendChild โหนดเดิมคือย้าย'),
      O('The existing node is copied automatically.', false, 'ถ้าต้องการสำเนาต้อง clone เอง'),
      O('The same node stays a direct child of both lists.', false, 'node มี parent ได้ตำแหน่งเดียวใน tree'),
      O('The existing node is removed from listA as part of moving it.', true, 'ไม่ต้อง remove จาก parent เดิมก่อน')
    ], `const item = listA.firstElementChild;
listB.appendChild(item);`),
    Q('dom', 'Select all correct statements about reading values.', 'เลือกทุกข้อที่ถูกเกี่ยวกับการอ่านค่า', [
      O('textInput.value reads the current text input value.', true, 'ไม่ใช้ textContent กับค่าที่พิมพ์ใน input'),
      O('checkbox.checked reports its current checked state.', true, 'ได้ boolean'),
      O('checkbox.value is a boolean indicating whether it is checked.', false, 'value เป็นค่าของ control'),
      O('paragraph.textContent can read its text.', true, 'ข้อความใน p อ่านด้วย textContent')
    ]),
    Q('dom', 'button refers to the element below. Select all correct statements about its data attribute.', 'ตัวแปร button อ้าง element ด้านล่าง เลือกทุกข้อที่ถูกเกี่ยวกับ data attribute นี้', [
      O('button.dataset.productId is "10".', true, 'ชื่อ camelCase และค่า string'),
      O('button.dataset.productId is the number 10.', false, 'ต้องแปลงเองด้วย Number'),
      O('Number(button.dataset.productId) is 10.', true, 'แปลง string ตัวเลขเป็น number'),
      O('button.dataset.product-id is the correct property syntax.', false, 'dash ใน dot syntax กลายเป็น operator ลบ ไม่ใช่ชื่อ property')
    ], '<button data-product-id="10">Buy</button>'),
    Q('dom', 'Select all correct statements about HTML and classes.', 'เลือกทุกข้อที่ถูกเกี่ยวกับข้อความ HTML และ class', [
      O('textContent treats "<b>Hi</b>" as text.', true, 'ไม่ parse เป็น element'),
      O('innerHTML can parse markup into DOM content.', true, 'จึงต้องระวังข้อมูลผู้ใช้ที่ไม่เชื่อถือ'),
      O('classList.toggle("open") only adds the class.', false, 'มีอยู่จะลบ ไม่มีจะเพิ่ม'),
      O('classList.contains("open") returns a boolean.', true, 'ตรวจว่ามี class หรือไม่')
    ]),
    Q('dom', 'Select all correct statements about closest() and matches().', 'เลือกทุกข้อที่ถูกเกี่ยวกับ closest และ matches', [
      O('closest() checks the element itself before its ancestors.', true, 'เริ่มที่ตัวเองแล้วไล่ขึ้น'),
      O('closest() returns null when no element matches.', true, 'ต้องรองรับกรณีหาไม่พบ'),
      O('matches() searches every descendant.', false, 'matches ตรวจเฉพาะ element นั้น'),
      O('closest() searches downward through all children.', false, 'ทิศคือขึ้น ancestor')
    ]),
    Q('dom', 'Select all correct statements about removal and the document.', 'เลือกทุกข้อที่ถูกเกี่ยวกับการลบและ document', [
      O('element.remove() removes that element from its parent.', true, 'เรียกบนตัวที่จะลบ'),
      O('parent.removeChild(child) requires child to be a direct child.', true, 'ไม่รับหลานทุกระดับ'),
      O('document.firstChild is guaranteed to be the html element.', false, 'อาจเป็น DocumentType เมื่อมี doctype'),
      O('document.documentElement refers to the root element of the document.', true, 'ใน HTML ปกติคือ html element')
    ]),
    Q('storage', 'Select all correct statements about Web Storage values.', 'เลือกทุกข้อที่ถูกเกี่ยวกับค่าจาก Web Storage', [
      O('The stored value is read back as the string "3".', true, 'setItem แปลงเป็น string'),
      O('Reading a missing key with getItem() returns null.', true, 'ไม่ใช่ undefined'),
      O('localStorage.getItem("count") + 1 produces the number 4.', false, 'เมื่อเก็บ 3 จะได้ "31"'),
      O('Number(localStorage.getItem("count")) + 1 produces 4 here.', true, 'แปลงเป็น number ก่อนบวก')
    ], 'localStorage.setItem("count", 3);'),
    Q('storage', 'Select all correct statements about JSON and storage.', 'เลือกทุกข้อที่ถูกเกี่ยวกับ JSON และ Storage', [
      O('JSON.stringify(cart) converts a serializable cart into a JSON string.', true, 'แปลงก่อนเก็บ'),
      O('JSON.parse(raw) can restore an array represented by valid JSON.', true, 'หลัง parse จึงใช้ Array methods'),
      O('Changing a parsed object automatically updates its stored JSON.', false, 'ต้อง setItem บันทึกใหม่'),
      O('setItem() can preserve methods of an object without serialization.', false, 'Web Storage เก็บ string ไม่ใช่ object สด')
    ]),
    Q('storage', 'Select all correct statements about sessionStorage.', 'เลือกทุกข้อที่ถูกเกี่ยวกับ sessionStorage', [
      O('Reloading the same tab can retain its sessionStorage.', true, 'อยู่ใน page session เดิม'),
      O('Switching to another tab deletes the first tab\'s sessionStorage.', false, 'แค่เปลี่ยนแท็บไม่ลบ'),
      O('Its page session is associated with a browser tab and origin.', true, 'แยกตามแท็บและ origin'),
      O('Every tab continuously shares one live sessionStorage object.', false, 'แท็บแยกกัน แม้อาจเริ่มจากสำเนา opener')
    ], '', S.session),
    Q('storage', 'Select all correct statements about localStorage.', 'เลือกทุกข้อที่ถูกเกี่ยวกับ localStorage', [
      O('It has a built-in expiry argument in setItem().', false, 'ต้องเขียน expiry เองหากต้องการ'),
      O('It is normally shared by same-origin tabs in the same browser profile.', true, 'ภายใต้ browser policy เดียวกัน'),
      O('It is automatically included in every HTTP request.', false, 'Cookie เท่านั้นในตัวเลือกนี้ที่ส่งอัตโนมัติตามเงื่อนไข'),
      O('Its values can survive closing and reopening the browser.', true, 'โดยทั่วไปอยู่จนถูกลบ ไม่ใช่สัญญาว่า browser ไม่มีวันลบ')
    ]),
    Q('storage', 'Select all correct statements about storage operations.', 'เลือกทุกข้อที่ถูกเกี่ยวกับคำสั่ง Storage', [
      O('removeItem("theme") removes the named key from that storage.', true, 'ลบเฉพาะ key'),
      O('localStorage.clear() also deletes sessionStorage and cookies.', false, 'ไม่ลบข้ามชนิด'),
      O('setItem() can replace an existing value for the same key.', true, 'เพิ่มหรือเขียนทับ key นั้น'),
      O('Malformed JSON can make JSON.parse() throw an exception.', true, 'ใช้ try/catch เมื่อโจทย์ต้องรองรับข้อมูลเสีย')
    ]),
    Q('storage', 'The server at https://example.com sets this cookie. Ignore SameSite and other browser policies. Which request URLs meet Domain, Path and Secure?', 'Server ที่ https://example.com ตั้ง Cookie นี้ ไม่พิจารณา SameSite/นโยบายอื่น เลือก URL ที่ผ่าน Domain, Path และ Secure', [
      O('https://example.com/shop/cart', true, 'domain ตรง path เป็นเส้นทางย่อย และ HTTPS'),
      O('https://sub.example.com/shop', true, 'ระบุ Domain จึงรับ subdomain และ path ตรง'),
      O('https://example.com/shopping', false, '/shopping ไม่ใช่ขอบเขต /shop'),
      O('http://example.com/shop', false, 'Secure ต้อง HTTPS สำหรับ domain ตัวอย่างนี้')
    ], 'Set-Cookie: offer=yes; Domain=example.com; Path=/shop; Secure'),
    Q('storage', 'The server at https://app.example.com sets this cookie. Select all correct statements.', 'Server ที่ app.example.com ตั้ง Cookie นี้ เลือกทุกข้อที่ถูก โดยสมมติยังไม่หมดอายุและไม่มีนโยบายอื่นกีดกัน', [
      O('It is host-only because Domain is omitted.', true, 'ใช้กับ host ที่ตั้ง'),
      O('A matching request to app.example.com can include it.', true, 'host ตรงและ path=/'),
      O('A request to api.example.com must include it.', false, 'คนละ host และไม่ได้ระบุ Domain'),
      O('Omitting Domain makes it available to every subdomain.', false, 'ตรงข้ามกับ host-only')
    ], 'Set-Cookie: theme=dark; Path=/'),
    Q('storage', 'Select all correct statements about cookie security flags.', 'เลือกทุกข้อที่ถูกเกี่ยวกับ Secure และ HttpOnly', [
      O('Secure and HttpOnly perform different jobs.', true, 'HTTPS กับการเข้าถึงจาก JS คนละด้าน'),
      O('HttpOnly cookies are not stored by the browser.', false, 'Browser ยังเก็บและส่งตามเงื่อนไข'),
      O('JavaScript can set HttpOnly through document.cookie.', false, 'ต้องมาจาก Set-Cookie server'),
      O('HttpOnly hides the cookie from document.cookie.', true, 'JS getter ไม่คืน Cookie ที่มี flag นี้')
    ], '', S.cookie),
    Q('storage', 'Select all correct statements about cookie expiry.', 'เลือกทุกข้อที่ถูกเกี่ยวกับวันหมดอายุ Cookie', [
      O('Max-Age=3600 represents one hour.', true, 'หน่วยวินาที'),
      O('Date.now() returns a millisecond timestamp.', true, 'ระวังต่างหน่วยกับ Max-Age'),
      O('Max-Age has priority when both it and Expires are set.', true, 'เมื่อทั้งสองมีอยู่ Max-Age ชนะ'),
      O('A deletion cookie can use any Path regardless of the original.', false, 'ต้องตรงชื่อและ scope เดิม')
    ]),
    Q('storage', 'Select all correct statements about document.cookie.', 'เลือกทุกข้อที่ถูกเกี่ยวกับ document.cookie', [
      O('Assigning a cookie string normally sets one name/value pair.', true, 'ไม่ได้ล้าง Cookie อื่นทั้งหมด'),
      O('Its getter includes the Path and Secure attributes.', false, 'getter คืน name=value ไม่คืน attributes'),
      O('With no accessible cookies, its getter returns an empty string.', true, 'ไม่ใช่ null'),
      O('encodeURIComponent() encrypts a cookie so users cannot read it.', false, 'เป็น encoding ไม่ใช่ encryption')
    ]),
    Q('javascript', 'Select all correct statements about values.', 'เลือกทุกข้อที่ถูกเกี่ยวกับชนิดและค่าของ JavaScript', [
      O('typeof [] evaluates to "object".', true, 'ใช้ Array.isArray ตรวจ array'),
      O('Boolean("false") evaluates to false.', false, 'string ไม่ว่างเป็น truthy'),
      O('An empty array is truthy.', true, '[] ไม่ใช่ falsy'),
      O('"5" === 5 evaluates to true.', false, 'strict equality ไม่แปลงชนิด')
    ]),
    Q('javascript', 'Select all correct statements about const and objects.', 'เลือกทุกข้อที่ถูกเกี่ยวกับ const และ object', [
      O('Changing user.name is allowed.', true, 'แก้เนื้อหา object ได้'),
      O('Reassigning user to a new object is allowed.', false, 'const ห้ามเปลี่ยน binding'),
      O('Two separately created objects are strictly equal when their fields match.', false, 'เปรียบเทียบ reference'),
      O('const makes every nested property immutable.', false, 'const ไม่ได้ freeze object')
    ], 'const user = { name: "Ann" };'),
    Q('javascript', 'Select all correct statements about these functions.', 'เลือกทุกข้อที่ถูกเกี่ยวกับฟังก์ชันสองตัวนี้', [
      O('a(3) evaluates to 6.', true, 'arrow expression คืนค่าโดยตรง'),
      O('b(3) evaluates to undefined.', true, 'มี block แต่ไม่มี return'),
      O('b(3) evaluates to 6.', false, 'ไม่ได้คืนผลคูณ'),
      O('A function without a returned value automatically returns null.', false, 'ได้ undefined')
    ], `const a = x => x * 2;
const b = x => { x * 2; };`),
    Q('javascript', 'Select all correct statements about array methods.', 'เลือกทุกข้อที่ถูกเกี่ยวกับ Array methods', [
      O('map() returns a new array.', true, 'ใช้แปลงสมาชิก'),
      O('forEach() returns undefined.', true, 'ไม่ได้คืน array ของผล callback'),
      O('find() returns an empty array when nothing matches.', false, 'คืน undefined'),
      O('filter() can return an empty array.', true, 'กรณีไม่มีสมาชิกผ่านเงื่อนไข')
    ]),
    Q('javascript', 'Select all correct statements about loops.', 'เลือกทุกข้อที่ถูกเกี่ยวกับ loop', [
      O('for...of can iterate over array values.', true, 'array เป็น iterable'),
      O('for...in iterates over enumerable property names.', true, 'ไม่ใช่ค่าของ array โดยตรง'),
      O('A while loop body must execute at least once.', false, 'เช็กก่อนทำจึงอาจไม่ทำ'),
      O('continue exits the entire enclosing loop.', false, 'ข้ามส่วนที่เหลือของรอบนี้ ส่วน break ออก loop')
    ]),
    Q('javascript', 'Select all correct statements after the code runs.', 'เลือกทุกข้อที่ถูกหลังโค้ดทำงาน', [
      O('original !== copy is true.', true, 'object ชั้นนอกเป็นคนละ reference'),
      O('original.profile === copy.profile is true.', true, 'spread เป็น shallow copy'),
      O('original.profile.name becomes "Bee".', true, 'แก้ nested object ที่ใช้ร่วมกัน'),
      O('Spread guarantees a deep copy of nested objects.', false, 'ต้องใช้วิธี deep clone ที่เหมาะสมต่างหาก')
    ], `const original = { profile: { name: "Ann" } };
const copy = { ...original };
copy.profile.name = "Bee";`),
    Q('javascript', 'Select all correct statements about defaults and dates.', 'เลือกทุกข้อที่ถูกเกี่ยวกับ default และ Date', [
      O('x is null after the destructuring statement.', true, 'default ไม่แทน null'),
      O('new Date(2026, 0, 1) uses January as its month.', true, 'เดือนของ constructor แบบตัวเลขเริ่ม 0'),
      O('getMonth() returns values from 1 through 12.', false, 'คืน 0–11'),
      O('Date.now() returns seconds since the Unix epoch.', false, 'หน่วยมิลลิวินาที')
    ], 'const { x = 10 } = { x: null };'),
    Q('javascript', 'Select all correct statements about dialogs, regular expressions and modules.', 'เลือกทุกข้อที่ถูกเกี่ยวกับ dialogs, regex และ modules', [
      O('Canceling prompt() returns null.', true, 'กด OK โดยไม่พิมพ์ได้ string ว่าง'),
      O('/^\\d{3}$/ can require exactly three digits in the entire string.', true, 'มี anchors ต้นและท้ายโดยไม่มี multiline flag'),
      O('A browser module can be loaded with script type="module".', true, 'นามสกุล .js อย่างเดียวไม่พอ'),
      O('confirm() returns the text the user types.', false, 'confirm คืน boolean และไม่มีช่องให้พิมพ์')
    ])
  ];

  const labs = [
    {
      id: 'lab1', title: 'ฟอร์มสมัครสมาชิกที่ไม่หลง click', topic: 'events', minutes: 25,
      brief: 'ฝึก submit, value, condition และการรวบรวม error ใน VSCode สร้าง form ที่มี name, password, confirm และ p feedback ใช้ novalidate เพื่อฝึก validation ด้วย JS ตามโจทย์นี้',
      requirements: ['ผูก submit ที่ form แล้ว preventDefault เพื่อแสดงผลในหน้า', 'trim ชื่อและตรวจว่าไม่ว่าง ตรวจ password ไม่ว่างและตรงกับ confirm', 'แสดง error ที่พบทั้งหมด ถ้าผ่านให้แสดงชื่อที่สมัคร', 'ปุ่มล้างต้องเป็น type="button" และล้างข้อความ feedback ด้วย'],
      hints: ['อย่าผูกเฉพาะ click ของปุ่มส่ง เพราะการส่งฟอร์มมีได้หลายวิธี', 'ใช้ array เก็บข้อความ error แล้ว join', 'อ่านชื่อจาก value และแสดงข้อความด้วย textContent'],
      solution: `<form id="signup" novalidate>
  <label>Name <input id="name"></label>
  <label>Password <input id="password" type="password"></label>
  <label>Confirm <input id="confirm" type="password"></label>
  <button type="submit">สมัคร</button>
  <button id="clear" type="button">ล้าง</button>
</form>
<p id="feedback" aria-live="polite"></p>
<script>
const form = document.querySelector('#signup');
const feedback = document.querySelector('#feedback');
form.addEventListener('submit', event => {
  event.preventDefault();
  const name = document.querySelector('#name').value.trim();
  const password = document.querySelector('#password').value;
  const confirm = document.querySelector('#confirm').value;
  const errors = [];
  if (!name) errors.push('กรอกชื่อ');
  if (!password) errors.push('กรอก password');
  if (password !== confirm) errors.push('password ไม่ตรงกัน');
  feedback.textContent = errors.length ? errors.join(' / ') : 'สมัครสำเร็จ: ' + name;
  feedback.style.color = errors.length ? 'crimson' : 'green';
});
document.querySelector('#clear').addEventListener('click', () => {
  form.reset();
  feedback.textContent = '';
});
</script>`,
      checks: ['ส่งช่องว่างแล้วเห็นทุก error ที่เกี่ยวข้อง', 'ชื่อมีช่องว่างล้วนไม่ผ่าน', 'Password ต่างกันไม่ผ่าน', 'ค่าถูกต้องแล้วหน้าไม่ reload', 'ปุ่มล้างไม่ submit form']
    },
    {
      id: 'lab2', title: 'รายการงานกับ Event delegation', topic: 'dom', minutes: 30,
      brief: 'สร้างรายการงานที่เพิ่มทีหลังได้ และใช้ click listener เพียงตัวเดียวที่ ul สำหรับลบงาน',
      requirements: ['มี form เพิ่มงานจาก input โดยไม่รับข้อความว่าง', 'สร้าง li, span และ button ด้วย createElement', 'ปุ่มลบมีข้อความหรือ span ข้างในก็ลบได้เมื่อคลิก', 'ผูก click ที่ ul แล้วใช้ closest หา button และ li'],
      hints: ['target อาจเป็น span ในปุ่มจึงใช้ closest("button[data-remove]")', 'ตรวจว่าคลิกตรงส่วนที่ต้องการก่อนลบ', 'ใช้ textContent สำหรับข้อความงานของผู้ใช้'],
      solution: `<form id="add-form"><input id="task"><button>เพิ่ม</button></form>
<ul id="tasks"></ul>
<script>
const list = document.querySelector('#tasks');
const input = document.querySelector('#task');
document.querySelector('#add-form').addEventListener('submit', event => {
  event.preventDefault();
  const title = input.value.trim();
  if (!title) return;
  const li = document.createElement('li');
  const label = document.createElement('span');
  label.textContent = title;
  const button = document.createElement('button');
  button.type = 'button';
  button.dataset.remove = 'true';
  const icon = document.createElement('span');
  icon.textContent = 'ลบ';
  button.appendChild(icon);
  li.append(label, button);
  list.appendChild(li);
  input.value = '';
});
list.addEventListener('click', event => {
  const button = event.target.closest('button[data-remove]');
  if (!button || !list.contains(button)) return;
  button.closest('li').remove();
});
</script>`,
      checks: ['เพิ่มงานสามรายการแล้วลบเฉพาะอันกลางได้', 'คลิกตัว span ในปุ่มลบแล้วยังทำงาน', 'คลิกข้อความงานไม่ลบ', 'ไม่เพิ่มงานว่าง', 'ลูกที่เพิ่มใหม่ไม่ต้องผูก listener ลบเพิ่ม']
    },
    {
      id: 'lab3', title: 'จำ Theme และขนาดตัวอักษร', topic: 'storage', minutes: 30,
      brief: 'ฝึกวงจรอ่าน Storage → parse → แสดง DOM → รับ Event → บันทึกใหม่ เก็บ preference เป็น object',
      requirements: ['มี select light/dark และช่องขนาดตัวอักษร 14–24', 'เมื่อเปิดหน้า อ่าน localStorage key int151.demo.preferences หรือใช้ค่าเริ่มต้น', 'บันทึก object ด้วย JSON; ตรวจค่าเมื่อกู้คืน ไม่รับ theme/ขนาดนอกขอบเขต', 'Reset ลบ key ของแอปแล้วคืนค่าหน้าจอและ control'],
      hints: ['ค่าของช่อง number ยังอ่านจาก value เป็น string', 'ใช้ Number และ Number.isFinite ก่อนตรวจช่วง', 'JSON ผิดรูปแบบให้ fallback ด้วย try/catch'],
      solution: `<form id="prefs">
  <select id="theme"><option>light</option><option>dark</option></select>
  <input id="size" type="number" min="14" max="24" value="16" required>
  <button>Save</button><button id="reset" type="button">Reset</button>
</form>
<script>
const KEY = 'int151.demo.preferences';
const defaults = { theme: 'light', size: 16 };
const theme = document.querySelector('#theme');
const size = document.querySelector('#size');
function valid(p) {
  return p && ['light', 'dark'].includes(p.theme) &&
    Number.isFinite(p.size) && p.size >= 14 && p.size <= 24;
}
function apply(p) {
  theme.value = p.theme;
  size.value = p.size;
  document.body.style.background = p.theme === 'dark' ? '#18222f' : '#ffffff';
  document.body.style.color = p.theme === 'dark' ? '#ffffff' : '#18222f';
  document.body.style.fontSize = p.size + 'px';
}
let saved;
try { saved = JSON.parse(localStorage.getItem(KEY)); } catch { saved = null; }
apply(valid(saved) ? saved : defaults);
document.querySelector('#prefs').addEventListener('submit', event => {
  event.preventDefault();
  const p = { theme: theme.value, size: Number(size.value) };
  if (!valid(p)) return;
  localStorage.setItem(KEY, JSON.stringify(p));
  apply(p);
});
document.querySelector('#reset').addEventListener('click', () => {
  localStorage.removeItem(KEY);
  apply(defaults);
});
</script>`,
      checks: ['Save แล้ว reload ยังได้ preference เดิม', 'Reset คืนทั้งหน้าจอและ controls', 'ไม่มี key แล้วใช้ light/16', 'ลองตั้ง key เป็น JSON เสียแล้ว reload หน้าไม่พัง', 'ไม่ได้ใช้ clear() ลบข้อมูลของงานอื่น']
    },
    {
      id: 'lab4', title: 'ตัวนับเปิดหน้าที่ไม่ต่อ string', topic: 'storage', minutes: 20,
      brief: 'สร้างตัวนับสองตัว เปรียบเทียบ sessionStorage กับ localStorage ด้วยการ reload และเปิดแท็บอิสระ',
      requirements: ['อ่าน key int151.demo.visits จาก storage แต่ละชนิด', 'ไม่มีค่าหรือค่าผิดรูปแบบเริ่มที่ 1 มิฉะนั้นแปลงเป็น number แล้วเพิ่ม', 'แสดงผลแยก session กับ local', 'ทดลอง reload ในแท็บเดิมและแท็บอิสระ พร้อมเขียนอธิบายความต่าง'],
      hints: ['getItem ไม่พบคืน null', 'อย่าใช้ raw + 1', 'เปิดแท็บจาก opener อาจเริ่มด้วยสำเนา sessionStorage จึงใช้แท็บอิสระเพื่อเปรียบเทียบ'],
      solution: `<p>Session: <span id="session"></span></p>
<p>Local: <span id="local"></span></p>
<script>
function increment(storage) {
  const key = 'int151.demo.visits';
  const raw = storage.getItem(key);
  const old = Number(raw);
  const valid = raw !== null && Number.isSafeInteger(old) && old >= 0;
  const next = valid ? old + 1 : 1;
  storage.setItem(key, String(next));
  return next;
}
document.querySelector('#session').textContent = increment(sessionStorage);
document.querySelector('#local').textContent = increment(localStorage);
</script>`,
      checks: ['เริ่มไม่มี key ได้ 1 ทั้งคู่', 'reload ได้ 2 แล้ว 3 ไม่ใช่ 11 หรือ 111', 'session แท็บเดิมไม่หายเมื่อสลับแท็บ', 'local ใช้ร่วมใน same-origin browser profile เดียวกัน', 'ใส่ค่าที่ไม่ใช่ตัวเลขแล้วเริ่มใหม่ได้']
    },
    {
      id: 'lab5', title: 'ตะกร้าสินค้า Array of Objects', topic: 'javascript', minutes: 45,
      brief: 'โจทย์รวม JS + DOM + Event + Storage: สองสินค้าเพิ่มจำนวน ลบรายการ คำนวณยอด และคืนข้อมูลหลัง reload',
      requirements: ['สินค้า Pen ราคา 10 และ Book ราคา 50 มี id เป็น number', 'คลิกเพิ่มสินค้าซ้ำต้องเพิ่ม quantity ไม่สร้างแถวซ้ำ', 'render รายการและ total จาก state; ใช้ textContent และ DOM methods', 'ทุกครั้งที่แก้ state ต้องบันทึก array JSON ลง localStorage', 'ลบแล้ว reload ต้องไม่กลับมา'],
      hints: ['dataset.id เป็น string ต้อง Number ก่อนเทียบ id ด้วย ===', 'find หาสินค้าเดิม; filter ลบ; reduce รวมราคา', 'เรียก saveAndRender หลังทุกการแก้ state'],
      solution: `<button data-add="1">Add Pen</button><button data-add="2">Add Book</button>
<ul id="cart"></ul><p id="total"></p>
<script>
const KEY = 'int151.demo.cart';
const catalog = [{id:1,name:'Pen',price:10},{id:2,name:'Book',price:50}];
let cart = [];
try {
  const saved = JSON.parse(localStorage.getItem(KEY));
  if (Array.isArray(saved)) {
    cart = saved.filter(item => item && catalog.some(p => p.id === item.id) &&
      Number.isSafeInteger(item.quantity) && item.quantity > 0)
      .map(item => ({ id: item.id, quantity: item.quantity }));
  }
} catch { cart = []; }
const list = document.querySelector('#cart');
function render() {
  list.replaceChildren();
  for (const item of cart) {
    const product = catalog.find(p => p.id === item.id);
    const li = document.createElement('li');
    const text = document.createElement('span');
    text.textContent = product.name + ' x ' + item.quantity + ' = ' + product.price * item.quantity;
    const remove = document.createElement('button');
    remove.textContent = 'ลบ';
    remove.dataset.remove = item.id;
    li.append(text, remove);
    list.appendChild(li);
  }
  const total = cart.reduce((sum, item) => {
    return sum + catalog.find(p => p.id === item.id).price * item.quantity;
  }, 0);
  document.querySelector('#total').textContent = 'Total: ' + total;
}
function saveAndRender() {
  localStorage.setItem(KEY, JSON.stringify(cart));
  render();
}
document.querySelectorAll('[data-add]').forEach(button => {
  button.addEventListener('click', () => {
    const id = Number(button.dataset.add);
    const item = cart.find(p => p.id === id);
    if (item) item.quantity += 1;
    else cart.push({id, quantity:1});
    saveAndRender();
  });
});
list.addEventListener('click', event => {
  const button = event.target.closest('button[data-remove]');
  if (!button || !list.contains(button)) return;
  cart = cart.filter(item => item.id !== Number(button.dataset.remove));
  saveAndRender();
});
render();
</script>`,
      checks: ['Pen สองชิ้น Book หนึ่งชิ้นรวม 70', 'เพิ่มซ้ำได้แถวเดิม quantity เพิ่ม', 'reload แล้วตะกร้ายังอยู่', 'ลบแล้ว reload ไม่กลับมา', 'ตะกร้าว่างรวม 0 และไม่ throw']
    },
    {
      id: 'lab6', title: 'Cookie consent พร้อม scope ที่ลบถูก', topic: 'storage', minutes: 35,
      brief: 'ฝึก Cookie ก่อนสอบบน local web server: banner ยอมรับ/ปฏิเสธ จำผลหนึ่งวัน และปุ่มเปลี่ยนใจ ลองวิเคราะห์ domain/path ต่อบนกระดาษ',
      requirements: ['ใช้ Cookie ชื่อ int151_demo_consent ค่า yes/no อายุ 86400 วินาที Path=/', 'อ่าน Cookie ด้วยการแยกคู่ name=value ไม่ใช้ includes ที่อาจตรงชื่ออื่น', 'ตัดสินใจแล้วซ่อน banner และ reload แล้วยังจำได้', 'เปลี่ยนใจต้องลบ Cookie scope เดิม แล้วแสดง banner ใหม่', 'ตอบเอง: Path=/shop จะส่งไป /shopping หรือไม่ และ Secure ต่างจาก HttpOnly อย่างไร'],
      hints: ['getter document.cookie ไม่คืน attributes และไม่คืน HttpOnly', 'ตั้ง Cookie ครั้งละคู่; อย่าตีความว่า assign แล้วล้างทั้งหมด', 'JS ตั้ง HttpOnly ไม่ได้; ตัวอย่างฝึก localhost ไม่ใส่ Secure เพื่อให้ทดลองผ่าน HTTP ได้'],
      solution: `<div id="banner">
  <p>จำการตัดสินใจสำหรับตัวอย่างเรียน Cookie</p>
  <button data-choice="yes">ยอมรับ</button><button data-choice="no">ปฏิเสธ</button>
</div>
<p id="status"></p><button id="reconsider">เปลี่ยนใจ</button>
<script>
const NAME = 'int151_demo_consent';
const banner = document.querySelector('#banner');
const status = document.querySelector('#status');
function getCookie(name) {
  const prefix = encodeURIComponent(name) + '=';
  const entry = document.cookie.split(';').map(s => s.trim())
    .find(s => s.startsWith(prefix));
  return entry ? decodeURIComponent(entry.slice(prefix.length)) : null;
}
function render() {
  const choice = getCookie(NAME);
  const known = choice === 'yes' || choice === 'no';
  banner.hidden = known;
  status.textContent = known ? 'บันทึกแล้ว: ' + choice : 'ยังไม่ได้ตัดสินใจ';
}
banner.addEventListener('click', event => {
  const button = event.target.closest('button[data-choice]');
  if (!button || !banner.contains(button)) return;
  document.cookie = encodeURIComponent(NAME) + '=' +
    encodeURIComponent(button.dataset.choice) + '; Max-Age=86400; Path=/; SameSite=Lax';
  render();
});
document.querySelector('#reconsider').addEventListener('click', () => {
  document.cookie = encodeURIComponent(NAME) + '=; Max-Age=0; Path=/; SameSite=Lax';
  render();
});
render();
</script>

คำตอบ scope: /shop ไม่ครอบคลุม /shopping แต่ครอบคลุม /shop/cart
Secure คุมการส่ง HTTPS; HttpOnly กัน JS เข้าถึงและต้องตั้งจาก server`,
      checks: ['ยอมรับแล้ว banner ซ่อนและ reload ยังจำ', 'ปฏิเสธก็เก็บ no และซ่อน', 'เปลี่ยนใจลบ key เดิมแล้ว banner กลับมา', 'Cookie อื่นยังอยู่หลังตั้งตัวอย่างนี้', 'อธิบาย Path และสอง security flags ได้โดยไม่เปิดเฉลย']
    }
  ];

  const teacherNotes = [
    { title: 'Event และ Storage คือแกน แต่ต้องใช้ DOM + JS', detail: 'คาบท้ายย้ำ Event และ Client-side Storage และเตือนว่าอย่าทิ้ง DOM เพราะต้องเลือก element และแก้หน้าเว็บ พื้นฐาน array, object, function, loop, condition ยังต้องใช้ร่วมกัน ไม่มีข้อมูลยืนยันสัดส่วนคะแนนแยกบท', date: 'G1 15 ต.ค. / G2 14 ต.ค. 2569', kind: 'emphasis' },
    { title: 'ทฤษฎีภาษาอังกฤษ และเลือกผิดเสียคะแนนทั้งข้อ', detail: 'ประกาศกำหนดทฤษฎี 15 คะแนน 1 ชั่วโมง Closed book และปฏิบัติ 15 คะแนน 2 ชั่วโมง Restricted Resources คาบท้ายกล่าวถึงทฤษฎีประมาณ 30 ข้อและปฏิบัติ 2 ข้อ ผู้เรียนระบุว่า quiz ต้องเลือกชุดคำตอบถูกทั้งหมด จึงจำลองโหมดฝึกแบบครบชุดในเว็บนี้ ไม่อ้างว่าเป็นสูตรคะแนนย่อยทางการของ Exam-02', date: 'ประกาศสอบ / G1 15 ต.ค. / G2 14 ต.ค. 2569', kind: 'exam' },
    { title: 'Cookie domain/path มีรายละเอียดที่ต้องไล่เอง', detail: 'G1 พูดถึงการออกสอบโดยตรงในช่วงวิเคราะห์ domain/path ของ Cookie ต้องดูว่า request URL ใดได้รับ Cookie ใด และตรวจ HTTPS กับวันหมดอายุร่วมด้วย G2 ย้ำให้ทำแบบฝึกหัด Cookie ให้เสร็จ', date: 'G1 6 ต.ค. / G2 7 ต.ค. 2569', kind: 'emphasis' },
    { title: 'Event object ต้องอธิบายได้ทุกตัว', detail: 'อาจารย์ย้ำ target, currentTarget, type, eventPhase, preventDefault และ stopPropagation ให้ไล่เหตุการณ์จากโค้ดได้ โดยเฉพาะความต่างการยกเลิก default action กับการหยุด propagation', date: 'G1 15/22/29 ก.ย. / G2 16/23/30 ก.ย. 2569', kind: 'emphasis' },
    { title: 'Storage อ่านกลับเป็น string เป็นจุดพลาดบ่อย', detail: 'คาบ Web Storage ย้ำการแปลง Number ก่อนคำนวณ getItem ไม่พบได้ null และ JSON.stringify/parse กับ array หรือ object ต้องทำงานกับ array of objects ได้ และบันทึกใหม่หลังแก้ข้อมูลในหน่วยความจำ', date: 'G1 15 ต.ค. / G2 14 ต.ค. 2569', kind: 'emphasis' },
    { title: 'ฝึกกลางถึงยาก และรู้ว่าอะไรเป็นเรื่องเสริม', detail: 'อาจารย์แนะนำฝึกถึงระดับกลาง/ยาก เขียนเองและปรับ requirement ได้ CookieUtil ในเอกสารวิชาใช้ได้ตามกติกาทรัพยากรที่อนุญาต ส่วน Observer/design pattern และ IndexedDB เป็นบริบทเสริม ไม่ควรแย่งเวลาแกน Event/Storage', date: 'G1 6 ต.ค. / G2 30 ก.ย. และ 7 ต.ค. 2569', kind: 'extra' }
  ];

  window.STUDY_BANK = { facts, questions, labs, teacherNotes };
})();
