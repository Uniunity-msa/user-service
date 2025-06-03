let userInfo;
const startApiUrl = window.baseUrls.start;


const loadloginData = async () => {
  const res = await fetch("/auth/me", {
    credentials: "include", // 쿠키 포함
  });

  if (!res.ok) {
    alert("로그인이 필요합니다.");
    window.location.href = "/auth/login";
    return;
  }

  userInfo = await res.json();
};

const fetchWithdrawalUser = async (event) => {
  event.preventDefault(); // 기본 폼 제출 동작을 중단합니다. 비밀번호 값이 입력되지 않으면 중단
  const pwdElement = document.getElementById('pwd');

  if (!pwdElement.value) {
    alert('비밀번호를 입력해주세요.');
    return 
  }
  else {
    const req = {
      user_email: userInfo.user_email,
      psword: pwdElement.value
    }

    await fetch(`${apiUrl}/user/withdrawal`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include", // 쿠키 포함 필수
      body: JSON.stringify(req),
    })
    .then((res) => res.json())
    .then(res => {
      if (res.success) {
          alert("회원 탈퇴가 완료되었습니다.");
          window.location.href = `/mainpage`; 
      } else {
          alert("회원 탈퇴에 실패했습니다. 다시 시도해주세요.");
      }
    })
  }

}


// 페이지 로드 후 실행
window.addEventListener('DOMContentLoaded', async function () {
  await loadloginData();
});

