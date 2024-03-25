<script lang="ts" setup>
// meta
definePageMeta({
  layout: 'seo-page',
})
</script>

<template>
  <div class="guide">
    <h2>ご利用ガイド</h2>
    <div class="guide-menu">
      <ul>
        <li>
          <a href="#guide-trainer">
            <img
              src="../assets/images/arrow.svg"
              alt="配信動画・ガイド"
              class="mr-2"
            />
            <span>トレーナー登録</span>
          </a>
        </li>
        <li>
          <a href="#guide-group">
            <img
              src="../assets/images/arrow.svg"
              alt="配信動画・ガイド"
              class="mr-2"
            />
            <span>グループ登録</span></a
          >
        </li>
        <li>
          <a href="#guide-member">
            <img
              src="../assets/images/arrow.svg"
              alt="配信動画・ガイド"
              class="mr-2"
            />
            <span>利用者登録</span>
          </a>
        </li>
        <li>
          <a href="#guide-plan">
            <img
              src="../assets/images/arrow.svg"
              alt="配信動画・ガイド"
              class="mr-2"
            />
            <span>プラン更新・変更</span>
          </a>
        </li>
      </ul>
    </div>

    <div class="guide-content">
      <div id="guide-trainer">
        <div class="guide-title">
          <img src="../assets/images/trainer.svg" alt="" />
          <span>トレーナー登録</span>
        </div>
        <div class="guide-body">
          <div class="guide-step">
            <ul>
              <li>
                <span>1</span>
                <span
                  >メニューの「トレーナー登録」をクリックします。
                </span>
              </li>
              <li>
                <span>2</span>
                <span>
                  項目に沿って必要情報を入力て、登録ボタンをクリックします。
                </span>
              </li>
              <li>
                <span>3</span>
                <span>
                  ②で入力したアドレス宛にID・パスワードが記載されたメールが送信されます。トレーナーは届いたID・パスワードを使用してログインします。
                </span>
              </li>
              <li>
                <span>4</span>
                <span>
                  複数のトレーナーを登録する場合は、①～③を繰り返します。
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div id="guide-group">
        <div class="guide-title">
          <img src="../assets/images/group.svg" alt="" />
          <span>グループ登録</span>
        </div>
        <div class="guide-body">
          <div class="guide-step">
            <ul>
              <li>
                <span>1</span>
                <span>
                  メメニューの「グループ登録」をクリックします。
                </span>
              </li>
              <li>
                <span>2</span>
                <span>
                  項目に沿って必要情報を入力て、登録ボタンをクリックします。
                </span>
              </li>
              <li>
                <span>3</span>
                <span>
                  複数のグループを登録する場合は、①～②を繰り返します。
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div id="guide-member">
        <div class="guide-title">
          <img src="../assets/images/member.svg" alt="" />
          <span>利用者登録</span>
        </div>
        <div class="guide-body">
          <div class="guide-step">
            <ul>
              <li>
                <span>1</span>
                <span>
                  メニューの「利用者登録」をクリックします。
                </span>
              </li>
              <li>
                <span>2</span>
                <span>
                  項目に沿って必要情報を入力て、登録ボタンをクリックします。
                </span>
              </li>
              <li>
                <span>3</span>
                <span>
                  複数の利用者を登録する場合は、①～②を繰り返します。
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div id="guide-plan">
        <div class="guide-title">
          <img src="../assets/images/plan.svg" alt="" />
          <span>プラン更新</span>
        </div>
        <div class="guide-body">
          <div class="guide-step">
            <ul>
              <li>
                <span>1</span>
                <span>
                  メニューの「プラン」をクリックします。
                </span>
              </li>
              <li>
                <span>2</span>
                <span>
                  契約したいプランを選択し、プラン詳細画面を開きます。
                </span>
              </li>
              <li>
                <span>3</span>
                <span>
                  「本プラン内容で更新する場合は、こちらから更新してください。」をクリックします。
                </span>
              </li>
              <li>
                <span>4</span>
                <span>
                  プランを確認、依頼内容にコメントを記入し、「更新依頼」ボタンをクリックします。
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.guide {
  max-width: 994px;
  width: 90%;
  margin: 0 auto;
  padding: 100px 0 160px;

  h2 {
    font-size: 26px;
    font-weight: bold;
    letter-spacing: 0.08em;
    margin-bottom: 20px;
  }

  ul li {
    margin-bottom: 12px;

    a {
      color: #2cabdb;
      display: flex;
      text-decoration: underline;
      transition: all 0.2ms ease;
      user-select: none;
      cursor: pointer;

      &:hover {
        opacity: 0.6;
        transition: all 0.2ms ease;
      }
    }
  }

  .guide-content {
    .guide-title {
      padding-top: 78px;
      display: flex;
      align-items: center;
      font-size: 22px;
      font-weight: bold;
      padding-bottom: 22px;
      border-bottom: 1px solid #d8d8db;
    }

    .guide-body {
      .guide-step {
        ul > li {
          display: flex;
          align-items: center;

          > span {
            display: flex;
            margin-top: 20px;

            &:first-child {
              align-items: center;
              justify-content: center;
              display: inline-flex;
              width: 32px;
              height: 32px;
              margin-right: 16px;
              border-radius: 50%;
              font-size: 16px;
              font-style: bold;
              color: #fff;
              background: #2cabdb;
            }

            &:last-child {
              flex: 1;
              display: inline-flex;
              font-size: 16px;
              font-weight: 400;
            }
          }
        }
      }
    }
  }
}
</style>
