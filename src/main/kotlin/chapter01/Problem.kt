package chapter01

/* val과 var를 섞어서 간단한 가계부 프로그램을 작성하세요.
      - 요구 사항: 변수 3개 이상 사용, val은 고정 예산, var는 지출 누적
      - 출력 예시: Budget: 50000, Spent: 32000, Balance: 18000 */
fun Budget(spend: Int, current: Int = 50_000): Pair<Int, Int> {
    val newBalance = current - spend
    require(newBalance >= 0) { "예산 초과 ${-newBalance}" }
    return current to newBalance
}

/* 입력된 이름을 환영 메세지로 변환
   null , 빈 문자열 , 공백뿐인 값은 모두 Guest로 처리 */
fun welcome(input: String?): String {
    val name = input?.trim()?.takeIf { it.isNotBlank() } ?: "Guest"
    return "환영합니다, $name"
}

/* 값이 있을때는 2배 , 없으면 0을 반환 */
fun doubleorZero(value: Int): Int = value?.let {it * 2 } ?: 0

/* 점수 구간에 따라 평가 문자열을 반환
   90이상 : Excellent , 70이상 89 이하: Good , 그 외 : keep Practicing*/
fun level(score: Int): String = when (score) {
    in 90..100 -> "Excellent"
    in 70..89 -> "Good"
    else -> "keep Practicing"
}

/* 방문 횟수에 따라 메시지를 출력
   visitCount가 null이면 첫 방문 메시지를, 숫자일 경우에는 "환영합니다 , man! 오늘이 3번째 방문이네요" 형식 */
fun visit(name: String, visitCount: Int?): String {
    val displayName = name.trim().ifEmpty { "Guest" }
    return visitCount?.let { count ->
        "환영합니다, $displayName! 오늘은 ${count}번째 방문이네요."
    } ?: "첫 방문을 축하합니다, $displayName!"
}


/* 사용자 입력을 안전하게 Int로 변환하여 (성공 여부 , 결과값)을 반환
   변환 실패 시 결과값은 0 , 성공 여부는 false로 설정 */
fun success(input: String?): Pair<Boolean,Int> {
    val parsed = input?.trim()?.toIntOrNull()
    return if (parsed != null) {
        true to parsed
    } else {
        false to 0
    }
}