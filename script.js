/* --- DİL ÇEVİRİLERİ --- */
const translations = {
    en: {
        nav_home: "Home",
        nav_about: "About",
        nav_projects: "Projects",
        nav_experience: "Experience",
        nav_certificates: "Certificates",
        nav_contact: "Contact",
        btn_cv: "Download CV",
        hero_subtitle: "Computer Engineering Student | AI & Deep Learning Enthusiast",
        about_desc: "I am Ali Kemal Akdeniz, a 3rd-year Computer Engineering student at Selçuk University (GPA: 3.67). I am developing my skills in Machine Learning, Deep Learning, and Artificial Intelligence, and I frequently use PyTorch, TensorFlow, and Keras while working on model training and experimentation. I also use OpenCV for various vision-related tasks and ROS for mapping and basic autonomous system studies, as I continue exploring how AI techniques can be applied to real-world problems.",
        proj_bird_title: "Bird Species Classification",
        proj_bird_desc: "A deep learning model that classifies different bird species using CNNs and transfer learning.",
        proj_face_title: "Face Detection with OpenCV",
        proj_face_desc: "Real-time face detection system utilizing Haar Cascades and computer vision techniques.",
        exp_role: "Intern Engineer",
        exp_desc: "Gained practical experience in automotive production processes and observed software integration within the manufacturing industry.",
        section_education: "Education",
        edu_uni_name: "Selçuk University",
        edu_uni_dept: "Computer Engineering",
        edu_hs_name: "Ordu High School",
        edu_hs_dept: "Science Department",
        edu_hs_rank: "Valedictorian (1st Place)",
        cert_subtitle: "(Click to view)",
        cert_ml: "Machine Learning",
        cert_sql: "SQL with Applications",
        cert_dl: "Intro to Deep Learning",
        cert_python_ml: "Python ML Applications"
    },
    tr: {
        nav_home: "Ana Sayfa",
        nav_about: "Hakkımda",
        nav_projects: "Projeler",
        nav_experience: "Deneyim",
        nav_certificates: "Sertifikalar",
        nav_contact: "İletişim",
        btn_cv: "CV İndir",
        hero_subtitle: "Bilgisayar Mühendisliği Öğrencisi | Yapay Zeka Geliştiricisi",
        about_desc: "Ben Ali Kemal Akdeniz, Selçuk Üniversitesi Bilgisayar Mühendisliği 3. sınıf öğrencisiyim (GANO: 3.67). Makine Öğrenmesi, Derin Öğrenme ve Yapay Zeka alanlarında kendimi geliştiriyorum. Model eğitimi ve deneylerinde sıklıkla PyTorch, TensorFlow ve Keras kullanıyorum. Ayrıca görüntü işleme görevleri için OpenCV ve haritalama ile otonom sistem çalışmaları için ROS kullanıyorum.",
        proj_bird_title: "Kuş Türleri Sınıflandırma",
        proj_bird_desc: "CNN ve transfer öğrenme kullanarak farklı kuş türlerini sınıflandıran derin öğrenme modeli.",
        proj_face_title: "OpenCV ile Yüz Tespiti",
        proj_face_desc: "Haar Cascades ve bilgisayarlı görü teknikleri kullanılarak gerçek zamanlı yüz tespit sistemi.",
        exp_role: "Stajyer Mühendis",
        exp_desc: "Otomotiv üretim süreçlerinde pratik deneyim kazandım ve üretim endüstrisindeki yazılım entegrasyonlarını gözlemledim.",
        section_education: "Eğitim",
        edu_uni_name: "Selçuk Üniversitesi",
        edu_uni_dept: "Bilgisayar Mühendisliği",
        edu_hs_name: "Ordu Lisesi",
        edu_hs_dept: "Fen Bilimleri Alanı",
        edu_hs_rank: "Okul Birincisi",
        cert_subtitle: "(Görüntülemek için tıkla)",
        cert_ml: "Makine Öğrenmesi",
        cert_sql: "Uygulamalarla SQL",
        cert_dl: "Derin Öğrenmeye Giriş",
        cert_python_ml: "Python ile ML Uygulamaları"
    }
};

/* DİL DEĞİŞTİRME FONKSİYONU */
function setLanguage(lang) {
    // Tüm data-key etiketli elementleri bul
    document.querySelectorAll('[data-key]').forEach(elem => {
        const key = elem.getAttribute('data-key');
        if (translations[lang][key]) {
            elem.innerText = translations[lang][key];
        }
    });
}

/* MODAL (RESİM) FONKSİYONLARI */
function openModal(imageSrc) {
    const modal = document.getElementById("imageModal");
    const modalImg = document.getElementById("modalImg");
    modal.style.display = "block";
    modalImg.src = imageSrc;
}

function closeModal() {
    document.getElementById("imageModal").style.display = "none";
}

/* CANVAS VE ANİMASYON KODLARI (AYNEN KORUNDU) */
const canvas = document.getElementById('bgCanvas');
const ctx = canvas.getContext('2d');

let particlesArray = [];
let shootingStarsArray = [];
let mainContainerRect; 

function setupCanvas() {
    const dpr = window.devicePixelRatio || 1;
    canvas.width = window.innerWidth * dpr;
    canvas.height = document.body.scrollHeight * dpr; 
    ctx.scale(dpr, dpr);
    canvas.style.width = window.innerWidth + 'px';
    canvas.style.height = document.body.scrollHeight + 'px';
    
    updateContainerRect();
    init();
}

function updateContainerRect() {
    const mainContainer = document.querySelector('.main-container');
    if (mainContainer) {
        const rect = mainContainer.getBoundingClientRect();
        mainContainerRect = {
            top: rect.top + window.scrollY,
            bottom: rect.bottom + window.scrollY,
            left: rect.left,
            right: rect.right,
            width: rect.width
        };
    }
}

class ShapeParticle {
    constructor() {
        this.x = Math.random() * window.innerWidth;
        this.y = Math.random() * document.body.scrollHeight; 
        this.baseX = this.x; 
        this.baseY = this.y; 
        
        this.size = Math.random() * 8 + 4; 
        this.opacity = Math.random() * 0.4 + 0.2; 
        this.color = '#FFFFFF'; 
        
        this.rotation = Math.random() * Math.PI * 2; 
        this.rotationSpeed = (Math.random() - 0.5) * 0.002; 

        this.angle = Math.random() * Math.PI * 2; 
        this.wobbleSpeed = Math.random() * 0.01 + 0.005; 
        this.wobbleRange = Math.random() * 10 + 5; 

        this.shapeType = Math.floor(Math.random() * 4); 
    }

    draw() {
        const currentY = this.y; 
        if (mainContainerRect && 
            this.x > mainContainerRect.left && 
            this.x < mainContainerRect.right && 
            currentY > mainContainerRect.top && 
            currentY < mainContainerRect.bottom) {
            return; 
        }

        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rotation);
        ctx.fillStyle = `rgba(255, 255, 255, ${this.opacity})`;

        switch (this.shapeType) {
            case 0: ctx.fillRect(-this.size / 2, -this.size / 2, this.size, this.size); break; 
            case 1: ctx.beginPath(); ctx.arc(0, 0, this.size / 2, 0, Math.PI * 2); ctx.fill(); break; 
            case 2: this.drawPolygon(5); break; 
            case 3: this.drawPolygon(6); break; 
        }
        ctx.restore();
    }

    drawPolygon(sides) {
        let radius = this.size / 2;
        ctx.beginPath();
        for (let i = 0; i < sides; i++) {
            let angle = (i * 2 * Math.PI) / sides;
            ctx.lineTo(radius * Math.cos(angle), radius * Math.sin(angle));
        }
        ctx.closePath();
        ctx.fill();
    }

    update(scrollY) {
        this.angle += this.wobbleSpeed;
        const wobbleX = Math.cos(this.angle) * this.wobbleRange;
        const wobbleY = Math.sin(this.angle) * this.wobbleRange;
        this.x = this.baseX + wobbleX;
        this.y = (this.baseY - (scrollY * 0.2)) + wobbleY; 
        this.rotation += this.rotationSpeed;
        this.draw();
    }
}

class ShootingStar {
    constructor() {
        this.reset();
    }

    reset() {
        let safeZone = 'left';
        if (mainContainerRect) {
            if (Math.random() < 0.5) {
                const maxLeft = Math.max(0, mainContainerRect.left - 50);
                this.x = Math.random() * maxLeft;
            } else {
                const minRight = Math.min(window.innerWidth, mainContainerRect.right + 50);
                this.x = minRight + Math.random() * (window.innerWidth - minRight);
            }
        } else {
            this.x = Math.random() * window.innerWidth;
        }

        this.y = Math.random() * window.innerHeight / 2 + window.scrollY; 
        this.len = Math.random() * 100 + 80; 
        this.speed = Math.random() * 2 + 2; 
        this.size = Math.random() * 2 + 0.5; 
        this.dx = (Math.random() - 0.5) * 1; 
        this.dy = this.speed; 
    }

    draw() {
        ctx.save();
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.8)'; 
        ctx.lineWidth = this.size; 
        ctx.lineCap = 'round';
        ctx.beginPath();
        const gradient = ctx.createLinearGradient(this.x, this.y, this.x - this.dx * 10, this.y - this.dy * 10);
        gradient.addColorStop(0, `rgba(255, 255, 255, ${this.size})`); 
        gradient.addColorStop(1, 'rgba(255, 255, 255, 0)'); 
        ctx.strokeStyle = gradient;
        ctx.moveTo(this.x, this.y);
        ctx.lineTo(this.x - this.dx * (this.len / this.speed), this.y - this.dy * (this.len / this.speed)); 
        ctx.stroke();
        ctx.restore();
    }

    update() {
        this.x += this.dx;
        this.y += this.dy;
        if (this.y > document.body.scrollHeight + 200 || this.x < -100 || this.x > window.innerWidth + 100) {
            return false; 
        }
        this.draw();
        return true; 
    }
}

function init() {
    particlesArray = [];
    let numberOfParticles = (window.innerWidth * document.body.scrollHeight) / 12000; 
    for (let i = 0; i < numberOfParticles; i++) {
        particlesArray.push(new ShapeParticle());
    }
}

function animate() {
    requestAnimationFrame(animate);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const scrollY = window.pageYOffset || document.documentElement.scrollTop;
    particlesArray.forEach(particle => particle.update(scrollY));
    if (Math.random() < 0.02) {
        shootingStarsArray.push(new ShootingStar());
    }
    shootingStarsArray = shootingStarsArray.filter(star => star.update());
}

window.addEventListener('resize', () => { setupCanvas(); });
window.addEventListener('scroll', updateContainerRect);
setupCanvas();
animate();

const clickableElements = document.querySelectorAll('.clickable, .clickable-card');
clickableElements.forEach(el => {
    el.addEventListener('click', function(e) {
        this.classList.add('active-click');
        setTimeout(() => { this.classList.remove('active-click'); }, 200);
    });
});