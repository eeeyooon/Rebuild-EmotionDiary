# 💙 감정 일기장 리빌딩

<br/>
<br/>

![감정일기썸네일](https://github.com/eeeyooon/emotion-diary/assets/102462534/0e62639a-ac12-4033-8fcc-6165f261dbdf)

<br/>
<br/>

🗓 프로젝트 일정 : 2023.09.15 ~ 2023.10.02
🚀 프로젝트 목표 : [기존 감정 일기장](https://github.com/eeeyooon/emotion-diary)에 로그인 기능 추가, 파이어베이스 Firestore 연결하여 일기 데이터 관리 등

<br/>

💙 [새로운 감정 일기장 사용해보기](eeyooon-emotion-diary.web.app) (사용 전 [유의할 점]() 참고)

<br/>
<br/>

## 기존의 감정 일기장

- 로그인 없이 사이트 접속 시 누구나 일기 데이터를 작성,수정,삭제 할 수 있음.
- 일기 데이터는 브라우저의 localstorage에 관리됨.

<br/>

> **그에 따른 문제점** <br/> - 같은 브라우저라면 작성한 사람이 누구든 일기 데이터를 접근할 수 있음. <br/> - 다른 브라우저에서 작성한 일기는 조회 및 접근할 수 없음. <br/> - 데이터를 브라우저에 저장하기 때문에 DB관리가 불안정함. <br/>

<br/>
<br/>

## 새로운 감정 일기장

> 일기 작성, 수정, 삭제 및 감정 필터링과 날짜 정렬은 기존 기능과 동일함.

<br/>

### 1. 카카오 로그인

카카오 로그인 시, 해당 유저의 정보를 따로 관리하여 해당 유저가 작성한 일기 데이터는 해당 유저만 접근이 가능하다. 카카오 로그인 API를 사용하여 별도의 회원가입 과정없이 간편하게 감정 일기장을 사용할 수 있다.

<br/>

### 2. Firebase FireStore를 통한 데이터 관리

브라우저의 `LocalStorage`가 아닌 별도의 데이터베이스에서 일기 데이터를 관리한다. 그렇기 때문에 브라우저에 상관없이 유저가 로그인만 하면 어디에서 작성하였든 유저가 작성한 일기 데이터를 접근할 수 있다. 다른 유저는 본인이 작성한 일기 데이터 외의 다른 유저의 데이터에는 접근할 수 없다.

<br/>
<br/>

## 구현 화면

### 카카오 로그인

| 카카오 로그인                                                                                                                | 월별 조회 및 로그아웃                                                                                                                    |
| ---------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------- |
| ![감정_카카오로그인](https://github.com/eeeyooon/Rebuild-EmotionDiary/assets/102462534/7b7cb613-aa5e-489a-9957-85c1ddc9522a) | ![감정_카카오월별조회및로그아웃](https://github.com/eeeyooon/Rebuild-EmotionDiary/assets/102462534/d0cac645-52d4-49ab-9709-65e0865bc12c) |

<br/>

| 일기 작성                                                                                                                    | 일기 수정 및 삭제                                                                                                          |
| ---------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------- |
| ![감정_카카오글작성](https://github.com/eeeyooon/Rebuild-EmotionDiary/assets/102462534/601f04e1-70a3-4930-8887-759fe7ac037c) | ![감정_카카오수정](https://github.com/eeeyooon/Rebuild-EmotionDiary/assets/102462534/cb837d98-b2a8-428b-8bf8-743ab0997a3e) |

<br/>
<br/>

### 비회원 로그인

| 비회원 일기 작성                                                                                                             | 일기 수정 및 삭제                                                                                                              |
| ---------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------ |
| ![감정_비회원글작성](https://github.com/eeeyooon/Rebuild-EmotionDiary/assets/102462534/7f2d7efb-acac-4bea-8bd3-9be4c1f29281) | ![감정_비회원수정삭제](https://github.com/eeeyooon/Rebuild-EmotionDiary/assets/102462534/5688041a-7661-44af-903a-cbde5040b49e) |

<br/>

## 유의할 점

- 이 서비스는 실습용 프로젝트이기 때문에 서비스의 현실성이나 보안적인 측면은 생각하지 않았습니다. 카카오 로그인 역시 api 사용 및 기능 구현에만 의의를 두고 있습니다. 카카오 로그인 시, 유저의 카카오 로그인 여부와 유저의 로그인된 이메일이 로컬스토리지에 저장되어 보안 취약점이 존재하므로 `이 점을 유의해 중요하거나 개인적인 내용은 적지 않도록 주의해주십시오.`

- `비회원으로 로그인하기`가 가능하기 때문에 카카오 로그인이 불안할 경우 비회원으로 체험해주시길 바랍니다.

- 서비스 관리자는 일기 데이터 조회가 가능하기 때문에 테스트용으로만 사용하시길 당부드립니다.

<br/>
<br/>
