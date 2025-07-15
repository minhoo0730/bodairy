export default {
  // 주어진 이름의 쿠키 값을 반환하는 함수
  getCookie: name => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
  }
}