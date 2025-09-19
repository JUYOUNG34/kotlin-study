package chapter02

/**
  Kotlin Null-Safety 개념 정리
  - 모든 참조 타입은 nullable 여부를 명시한다. (String vs String?)
  - 안전 호출(?.): null이면 전체 표현식이 null, 아니면 이어서 실행한다
  - 엘비스(?:): 왼쪽이 null일 때 기본값이나 예외를 지정한다
  - not-null 단정(!!): null이면 NPE를 던지고, 아니면 non-null로 취급한다
  - 플랫폼/외부 입력은 항상 nullable로 가정하고 처리 흐름을 설계한다
 */
fun main() {
    val message: String? = readExternalInput()

    val safeLength = message?.length ?: 0
    println("Safe length: $safeLength")

    val startsWithA = message?.startsWith('A') ?: false
    println("Starts with 'A': $startsWithA")

    try {
        val required = message ?: throw IllegalArgumentException("Message is required")
        println("Required message: ${required.uppercase()}")
    } catch (e: IllegalArgumentException) {
        println("require 실패 → ${e.message}")
    }

    try {
        println("!! demo: ${message!!.uppercase()}")
    } catch (e: NullPointerException) {
        println("!! 사용 시 null이면 NPE 발생")
    }
}

private fun readExternalInput(): String? {
    return if (System.currentTimeMillis() % 2L == 0L) "Apple" else null
}