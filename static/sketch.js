let music;
let isStarted = false;
let particles = [];
let shapeState = 0;
let timeStarted = 0;

const palettes = {
  galaxy: ["#00d4ff", "#0052d4", "#6a11cb", "#ffffff"],
  vortex: ["#8BE9FD", "#BD93F9", "#50fa7b", "#ff79c6"],
  romance: ["#FF79C6", "#CF6292", "#F8F8F2", "#BD93F9"],
  butterfly: ["#08f7fe", "#09d1f7", "#a770ef", "#ffacfc"],
  infinity: ["#fdfcfb", "#a1c4fd", "#2575fc", "#6272A4"],
  swan: ["#ffffff", "#fdfcfb", "#a1c4fd", "#8BE9FD"],
  stardust: ["#452C63", "#1B1B3A", "#fdfcfb", "#a1c4fd"],
  // Bổ sung màu cho Red Thread và Fireworks để rải màu nhiều hơn
  redThread: ["#ff0000", "#ff4d4d", "#ff9999", "#ffffff", "#cc0000"],
  fireworks: [
    "#FF79C6",
    "#BD93F9",
    "#F8F8F2",
    "#00d4ff",
    "#6a11cb",
    "#ffacfc",
    "#50fa7b",
  ],
};

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

function preload() {
  // Thay đường dẫn này bằng link nhạc của bạn
  music = loadSound("/static/linhlinh.mp3");
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  background(0);

  const seal = document.getElementById("seal-btn");
  const wrapper = document.getElementById("welcome-wrapper");
  const envelope = document.getElementById("envelope");

  if (seal) {
    seal.onclick = (e) => {
      e.stopPropagation();
      if (envelope) envelope.classList.add("is-open");
    };
  }

  if (wrapper) {
    wrapper.onclick = () => {
      if (envelope && envelope.classList.contains("is-open")) startExperience();
    };
  }

  // --- XỬ LÝ NÚT TRẢI LÒNG CỦA BẠN (Giữ nguyên) ---
  const confessBtn = document.getElementById("confess-btn");
  const modal = document.getElementById("confess-modal");
  const nextBtn = document.getElementById("next-part-btn");
  const textArea = document.getElementById("confess-text-area");
  const title = document.getElementById("confess-title");

  if (confessBtn) {
    confessBtn.onclick = () => {
      modal.style.display = "flex";
    };
  }

  if (nextBtn) {
    nextBtn.onclick = () => {
      if (nextBtn.innerText.includes("Kế tiếp")) {
        if (title) title.innerText = "Yups bắt đầu nhé";
        if (textArea) {
          textArea.innerHTML =
            "Đối với tui, khi quen biết Linh từ lúc vào viện tới giờ thì tui thấy Linh là một người tự lập, mạnh mẽ, bên cạnh đó cũng có mặt dịu dàng.Tui làm cái này là vì tui muốn làm thoii,mong rằng Linh sẽ thích(cái này chỉ gửi riêng cho Linh thoi áaa)";
          nextBtn.innerText = "Cảm ơn Linh vì đã xemm nhaa";
        }
      } else {
        modal.style.display = "none";
      }
    };
  }
}

function startExperience() {
  if (isStarted) return;
  isStarted = true;
  timeStarted = millis();
  if (music && !music.isPlaying()) {
    music.setVolume(0.4);
    music.play();
  }
  const wrapper = document.getElementById("welcome-wrapper");
  if (wrapper) {
    wrapper.style.opacity = "0";
    setTimeout(() => {
      wrapper.style.display = "none";
    }, 1000);
  }
}

function draw() {
  background(0, 25);
  if (!isStarted) return;

  let elapsed = millis() - timeStarted;

  // --- HỆ THỐNG TIMING KHỚP VỚI BÀI HÁT ---
  if (elapsed < 12000)
    shapeState = 0; // Trăng khuyết (Intro)
  else if (elapsed < 28000)
    shapeState = 1; // Thành phố mờ ảo
  else if (elapsed < 45000)
    shapeState = 2; // Cột đèn đường
  else if (elapsed < 58000)
    shapeState = 3; // Vệt đèn xe
  else if (elapsed < 72000)
    shapeState = 4; // Bầu trời sao xoáy
  else if (elapsed < 84000)
    shapeState = 5; // Dấu vân tay
  else if (elapsed < 98000)
    shapeState = 6; // Nhịp tim đôi (Chorus 1)
  else if (elapsed < 112000)
    shapeState = 7; // Hai vòng tròn lồng nhau
  else if (elapsed < 125000)
    shapeState = 8; // Bóng người khiêu vũ
  else if (elapsed < 140000)
    shapeState = 9; // Ly rượu vang
  else if (elapsed < 155000)
    shapeState = 10; // Sóng biển đêm
  else if (elapsed < 168000)
    shapeState = 11; // Sợi dây tơ hồng
  else if (elapsed < 190000)
    shapeState = 12; // Đồng hồ cát chảy ngược
  else if (elapsed < 210000)
    shapeState = 13; // Cánh hoa rơi
  else if (elapsed < 232000)
    shapeState = 14; // Hộp nhạc (Outro)
  else {
    if (shapeState !== 15) {
      shapeState = 15;
      showFinalWish();
    }
  }

  // Duy trì số lượng hạt
  if (particles.length < 1300) particles.push(new Particle());

  push();
  blendMode(ADD); // Giúp các hạt sáng rực lên khi chồng vào nhau
  for (let p of particles) {
    p.update(elapsed);
    p.show();
  }
  pop();
}

class Particle {
  constructor() {
    this.id = particles.length;
    this.role = random() > 0.6 ? "background" : "shaper";
    this.x = random(width);
    this.y = random(height);
    this.t = random(TWO_PI);
    this.angle = random(TWO_PI);
    this.size = random(2, 4);
    this.vx = random(-1, 1);
    this.vy = random(-1, 1);
    this.baseColor = this.getColorForState();
  }

  getColorForState() {
    let p;
    // Tối ưu hóa bảng màu để rải màu nhiều hơn
    if (shapeState <= 2) p = palettes.stardust;
    else if (shapeState <= 4) p = palettes.vortex;
    else if (shapeState <= 8) p = palettes.romance;
    else if (shapeState === 9)
      p = palettes.infinity; // Ly rượu
    else if (shapeState === 10)
      p = palettes.swan; // Sóng biển
    else if (shapeState === 11)
      p = palettes.redThread; // Dây tơ hồng
    else p = palettes.fireworks; // Đoạn cuối bùng nổ

    // SỬA: Rải màu đều hơn bằng Modulo (%)
    // Thay vì chọn ngẫu nhiên, ta dùng ID để phân bổ đều tất cả màu trong palette
    let index = this.id % p.length;
    return color(p[index]);
  }

  update(elapsed) {
    let sz = min(width, height);
    let tx = this.x;
    let ty = this.y;
    let t = this.t;

    // Cập nhật màu mượt mà mỗi giây
    if (frameCount % 60 === 0) {
      this.baseColor = lerpColor(this.baseColor, this.getColorForState(), 0.1);
    }

    if (this.role === "background" && shapeState !== 15) {
      this.x += this.vx * 0.3;
      this.y += this.vy * 0.3;
      if (this.x < 0 || this.x > width) this.vx *= -1;
      if (this.y < 0 || this.y > height) this.vy *= -1;
      return;
    }

    // --- LOGIC 15 HÌNH DẠNG (Giữ nguyên) ---
    if (shapeState === 0) {
      // Trăng khuyết
      let r0 = sz * 0.25;
      tx = width / 2 + r0 * cos(this.angle);
      ty = height / 2 + r0 * sin(this.angle);
      if (cos(this.angle) > 0.2) tx -= r0 * 0.4;
    } else if (shapeState === 1) {
      // Thành phố
      let xNorm = (this.id % 100) / 100;
      tx = width * 0.1 + xNorm * width * 0.8;
      let bHeight = noise(Math.floor(xNorm * 15)) * height * 0.4;
      ty = height * 0.8 - (((this.id * 7) % 100) / 100) * bHeight;
    } else if (shapeState === 2) {
      // Cột đèn
      tx =
        width / 2 +
        (this.angle < PI
          ? random(-5, 5)
          : (this.angle - PI) * 15 * random(-1, 1));
      ty = map(this.angle, 0, TWO_PI, height * 0.2, height * 0.8);
    } else if (shapeState === 3) {
      // Vệt đèn xe
      tx = (this.x + 15 + noise(this.id) * 10) % width;
      ty = height / 2 + sin(this.angle) * 150;
    } else if (shapeState === 4) {
      // Bầu trời xoáy
      let rV = t * 40;
      tx = width / 2 + rV * cos(t + frameCount * 0.02);
      ty = height / 2 + rV * sin(t + frameCount * 0.02);
    } else if (shapeState === 5) {
      // Dấu vân tay
      let rF = 15 * t;
      tx = width / 2 + rF * cos(t * 12);
      ty = height / 2 + rF * 1.5 * sin(t * 12);
    } else if (shapeState === 6) {
      // Nhịp tim đôi
      tx = map(this.angle, 0, TWO_PI, width * 0.1, width * 0.9);
      let pulse = sin(tx * 0.03 - frameCount * 0.15) * 80;
      let side = this.id % 2 === 0 ? 0 : 50;
      ty = height / 2 + pulse + side;
    } else if (shapeState === 7) {
      // Hai vòng lồng nhau
      let circ = this.id % 2 === 0 ? 1 : -1;
      tx = width / 2 + (sz / 5) * cos(t * 2) + circ * 60;
      ty = height / 2 + (sz / 5) * sin(t * 2);
    } else if (shapeState === 8) {
      // Bóng khiêu vũ
      tx =
        width / 2 + 80 * sin(this.angle) * noise(frameCount * 0.01 + this.id);
      ty = height / 2 + 120 * cos(this.angle);
    } else if (shapeState === 9) {
      // Ly rượu vang
      tx =
        width / 2 +
        (this.angle < PI ? this.angle * 30 - 45 : sin(this.angle) * 70);
      ty =
        height / 2 +
        (this.angle < PI ? 80 : -40 + sin(frameCount * 0.1 + this.x) * 10);
    } else if (shapeState === 10) {
      // Sóng biển
      tx = map(this.angle, 0, TWO_PI, 0, width);
      ty = height * 0.7 + sin(this.angle * 4 + frameCount * 0.05) * 40;
    } else if (shapeState === 11) {
      // Sợi tơ hồng
      tx = map(this.angle, 0, TWO_PI, width * 0.2, width * 0.8);
      ty = height / 2 + sin(this.angle * 2 + frameCount * 0.03) * 120;
    } else if (shapeState === 12) {
      // Đồng hồ cát ngược
      tx = width / 2 + random(-40, 40) * (this.y / height);
      ty = this.y - 2;
      if (ty < height * 0.2) ty = height * 0.8;
    } else if (shapeState === 13) {
      // Cánh hoa rơi
      ty = this.y + 1.5;
      tx = this.x + sin(frameCount * 0.02 + this.angle) * 1.5;
      if (ty > height) ty = 0;
    } else if (shapeState === 14) {
      // Hộp nhạc
      let gearR = sz * 0.25 + (Math.floor(this.angle * 10) % 2 === 0 ? 15 : 0);
      tx = width / 2 + gearR * cos(this.angle + frameCount * 0.01);
      ty = height / 2 + gearR * sin(this.angle + frameCount * 0.01);
    } else if (shapeState === 15) {
      // Kết thúc mờ dần
      this.size *= 0.98;
      tx = this.x + this.vx;
      ty = this.y + this.vy;
    }

    // Lực hút Morphing (hạt trôi về vị trí mục tiêu mượt mà)
    this.x = lerp(this.x, tx, 0.08);
    this.y = lerp(this.y, ty, 0.08);
    this.t += 0.02;
  }

  show() {
    noStroke();
    let c = color(this.baseColor);
    let alphaVal = shapeState >= 15 ? 50 : 180;

    // Hiệu ứng nhấp nháy cho điệp khúc
    if (shapeState === 6 || shapeState === 7) {
      alphaVal = 100 + 80 * sin(this.t * 5);
    }

    c.setAlpha(alphaVal);
    fill(c);
    ellipse(this.x, this.y, this.size);
  }
}

function showFinalWish() {
  const finalBox = document.getElementById("final-wish");
  const openBtn = document.getElementById("confess-btn");

  if (finalBox) {
    finalBox.style.display = "block";
    let op = 0;
    let anim = setInterval(() => {
      op += 0.05;
      finalBox.style.opacity = op;
      if (op >= 1) {
        clearInterval(anim);
        if (openBtn) openBtn.style.display = "block";
      }
    }, 50);
  }
}
