document.addEventListener("DOMContentLoaded", () => {
    const loginForm = document.getElementById("loginForm");
  
    loginForm.addEventListener("submit", async (e) => {
      e.preventDefault();
  
      const email = document.getElementById("email").value.trim();
      const password = document.getElementById("password").value;
  
      if (!email || !password) {
        alert("이메일과 비밀번호를 모두 입력해주세요.");
        return;
      }
  
      try {
        const res = await fetch("/auth/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          credentials: "include", // 쿠키 주고받기 위해 필요
          body: JSON.stringify({ email, password })
        });
  
        const data = await res.json();
  
        if (res.ok) {
          const startApiUrl = window.baseUrls.start;
          window.location.href = `/mainpage`; 
        } else {
          alert(data.message || "로그인에 실패했습니다.");
        }
      } catch (err) {
        console.error("로그인 에러:", err);
        alert("서버 연결에 실패했습니다.");
      }
    });
  });
  