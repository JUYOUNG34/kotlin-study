package chapter02

/*  문자열이 null이면 defaultLength를 반환
    null이 아니면 length를 반환 */
fun safeLength(str: String?, defaultLength: Int): Int = str?.length ?: defaultLength


/*  문자열이 null이면 IllegalArgumentException을 던짐
    null이 아닐 때만 'A'로 시작하는지 검사 */
fun requireStartsWithA(str: String?): Boolean = str?.startsWith("A") ?: throw IllegalArgumentException("null이 들어왔습니다")


/* null이면 null을, 값이 있으면 startsWith("A") 결과를 그대로 반환
   Boolean? 반환형을 유지 */
fun nullableStartsWithA(str: String?): Boolean? = str?.startsWith("A")

/*  null이면 false를 반환
    null이 아니면 startsWith("A") 결과를 반환 */
fun startsWithOrFalse(str: String?): Boolean = str?.startsWith("A") ?: false

/* null일 가능성이 없다고 확실할 때만 not-null 단정 연산자(!!)**를 사용
   null이 들어오면 NPE가 발생하게 두고, 값이 있으면 대문자로 변환환 뒤 반환 */
fun forceUpperCase(str: String?): String = str!!.uppercase()

/* 입력이 null이거나 공백이라면 "Guest"을 반환합니다 그렇지 않으면 앞뒤 공백을 제거하고 첫 글자면 대문자로 변환해 반환 */
fun formatUsername(input: String?): String {
    val cleaned = input?.trim()?. takeIf {it.isNotEmpty() } ?: return "Guest"
    return cleaned.replaceFirstChar { it.uppercaseChar() }
}

/* 환경에서 설정 값을 읽기 (예 : 파일 , 환경 변수 , 하드코딩) 값이 없으면 null을 반환 */
fun loadConfig(): String? = System.getenv("APP_CONFIG")?.takeIf { it.isNotBlank() }

/* config가 null이면 IllegalStateException("Missing config")을 던짐
   정상 값이라면 그대로 반환 */
fun requireConfig(config: String?): String = config ?: throw IllegalStateException("Missing config")

/* keywords 리스트에서 첫 번째 null이 아닌, 공백이 아닌 문자열을 찾아 반환 , 아무것도 없다면 "Np keywords"를 반환 */
fun firstKeyword(keywords: List<String?>): String = keywords.firstOrNull {
    !it.isNullOrBlank() }?.trim() ?: "No keywords"
/* 1. email이 null이면 즉시 NPE가 발생하도록 !! 연산자를 사용
   2. 대문자로 변환한 값을 반환 */
fun assertEmail(email: String?): String = email!!.uppercase()