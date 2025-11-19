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
        // Container'ın sayfa üzerindeki mutlak konumunu hesapla
        mainContainerRect = {
            top: rect.top + window.scrollY,
            bottom: rect.bottom + window.scrollY,
            left: rect.left,
            right: rect.right,
            width: rect.width
        };
    }
}

// ARKA PLAN ŞEKİLLERİ SINIFI
class ShapeParticle {
    constructor() {
        this.x = Math.random() * window.innerWidth;
        this.y = Math.random() * document.body.scrollHeight; 
        
        // HAREKET MANTIĞI DEĞİŞTİ: 
        // Artık sürekli gitmiyorlar, oldukları yerde salınıyorlar.
        this.baseX = this.x; // Orijinal X konumu
        this.baseY = this.y; // Orijinal Y konumu (Scroll hariç)
        
        this.size = Math.random() * 8 + 4; 
        this.opacity = Math.random() * 0.4 + 0.2; 
        this.color = '#FFFFFF'; 
        
        this.rotation = Math.random() * Math.PI * 2; 
        this.rotationSpeed = (Math.random() - 0.5) * 0.002; 

        // SALINIM (WOBBLE) AYARLARI
        this.angle = Math.random() * Math.PI * 2; // Başlangıç açısı
        this.wobbleSpeed = Math.random() * 0.01 + 0.005; // Ne kadar hızlı titneyecek
        this.wobbleRange = Math.random() * 10 + 5; // Ne kadar uzağa gidebilir (piksel)

        this.shapeType = Math.floor(Math.random() * 4); 
    }

    draw() {
        // Şekil şuan nerede?
        // this.y zaten update fonksiyonunda hesaplanıyor
        const currentY = this.y; 

        // Çizim Kontrolü: Eğer cisim main-container'ın içindeyse ve biz scroll yapmamışsak
        // (Daha güvenli bir kontrol için sadece koordinatlara bakıyoruz)
        if (mainContainerRect && 
            this.x > mainContainerRect.left && 
            this.x < mainContainerRect.right && 
            currentY > mainContainerRect.top && 
            currentY < mainContainerRect.bottom) {
            return; // Metinlerin altındaysa çizme
        }

        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rotation);
        ctx.fillStyle = `rgba(255, 255, 255, ${this.opacity})`;

        switch (this.shapeType) {
            case 0: ctx.fillRect(-this.size / 2, -this.size / 2, this.size, this.size); break; // Kare
            case 1: ctx.beginPath(); ctx.arc(0, 0, this.size / 2, 0, Math.PI * 2); ctx.fill(); break; // Daire
            case 2: this.drawPolygon(5); break; // Beşgen
            case 3: this.drawPolygon(6); break; // Altıgen
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
        // 1. PARALLAX: Scroll ile hareket (Yine kalsın, derinlik veriyor)
        // Ama bu sefer wobble (salınım) ekliyoruz
        this.angle += this.wobbleSpeed;
        
        // Olduğu yerde dairesel salınım (Sinüs ve Kosinüs ile)
        const wobbleX = Math.cos(this.angle) * this.wobbleRange;
        const wobbleY = Math.sin(this.angle) * this.wobbleRange;

        this.x = this.baseX + wobbleX;
        this.y = (this.baseY - (scrollY * 0.2)) + wobbleY; // Scroll hızı 0.2

        // Dönme
        this.rotation += this.rotationSpeed;
        
        this.draw();
    }
}

// KAYAN YILDIZ SINIFI
class ShootingStar {
    constructor() {
        this.reset();
    }

    reset() {
        // AKILLI KONUMLANDIRMA: Metinlerin üzerinden geçmesin
        let safeZone = 'left';
        
        // Eğer mainContainerRect tanımlıysa (sayfa yüklendiyse)
        if (mainContainerRect) {
            // %50 ihtimalle sol boşluk, %50 ihtimalle sağ boşluk
            if (Math.random() < 0.5) {
                // SOL TARAFTA OLUŞTUR (0 ile container solu arası)
                // Güvenlik payı olarak 20px boşluk bırakıyoruz
                const maxLeft = Math.max(0, mainContainerRect.left - 50);
                this.x = Math.random() * maxLeft;
            } else {
                // SAĞ TARAFTA OLUŞTUR (Container sağı ile ekran sonu arası)
                const minRight = Math.min(window.innerWidth, mainContainerRect.right + 50);
                this.x = minRight + Math.random() * (window.innerWidth - minRight);
            }
        } else {
            // Yüklenmediyse rastgele (Fallback)
            this.x = Math.random() * window.innerWidth;
        }

        this.y = Math.random() * window.innerHeight / 2 + window.scrollY; // Ekranın üst yarısından başlasın
        
        this.len = Math.random() * 100 + 80; 
        this.speed = Math.random() * 2 + 2; 
        this.size = Math.random() * 2 + 0.5; 
        
        // HAREKET YÖNÜ: Hafif çapraz aşağı
        // Çok yatay giderse container'a girebilir, o yüzden daha dik bir açı verelim.
        this.dx = (Math.random() - 0.5) * 1; // Yatay hız çok az olsun
        this.dy = this.speed; // Dikey hız baskın
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

        // Ekrandan çıkınca öldür
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

    // Kayan yıldız ihtimali
    if (Math.random() < 0.02) {
        shootingStarsArray.push(new ShootingStar());
    }

    shootingStarsArray = shootingStarsArray.filter(star => star.update());
}

window.addEventListener('resize', () => {
    setupCanvas();
});

window.addEventListener('scroll', updateContainerRect);

setupCanvas();
animate();

/* Tıklama Efektleri */
const clickableElements = document.querySelectorAll('.clickable, .clickable-card');
clickableElements.forEach(el => {
    el.addEventListener('click', function(e) {
        this.classList.add('active-click');
        setTimeout(() => {
            this.classList.remove('active-click');
        }, 200);
    });
});