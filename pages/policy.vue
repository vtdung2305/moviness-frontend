<script lang="ts" setup>
// meta
definePageMeta({
  layout: 'seo-page',
})
</script>

<template>
  <div class="policy">
    <h2>プライバシーポリシー</h2>
    <p>
      株式会社
      信成堂(以下､｢当社｣という｡)は､動作改善動画配信サービス｢moviness｣(以下､｢本サービス｣という｡)によって当社が取得した個人情報の取扱いに関し､個人情報の保護に関する法律､個人情報保護に関するガイドライン等の指針､その他個人情報保護に関する関係法令を遵守します｡
    </p>
    <h3>1.個人情報の安全管理</h3>
    <p>
      当社は､個人情報の保護に関して､組織的､物理的､人的､技術的に適切な対策を実施し､当社の取り扱う個人情報の漏えい､滅失又はき損の防止その他の個人情報の安全管理のために必要かつ適切な措置を講ずるものとします｡
    </p>
    <h3>2.個人情報の取得等の遵守事項</h3>
    <p>
      本サービスを通じた､当社による個人情報の取得､利用､提供については､以下の事項を遵守します｡
    </p>
    <h4>(1)個人情報の取得</h4>
    <p>
      当社は､本サービスを適切に遂行するために必要な範囲で､当社の利用者(以下｢お客様｣といいます｡)の個人情報を取得します｡
    </p>
    <h4>(2)個人情報の利用目的</h4>
    <p>
      当社は､当社が取得した個人情報について､法令に定める場合又は本人の同意を得た場合を除き､以下に定める利用目的の達成に必要な範囲を超えて利用することはありません｡<br />
      ･当社が提供する動画配信サービスなどを適切に遂行するため<br />
      ･お客様サポート､ご利用履歴管理､当社サービスのご案内など<br />
    </p>
    <h4>(3)個人情報の提供等</h4>
    <p>
      当社は､法令で定める場合を除き､本人の同意に基づき取得した個人情報を､本人の事前の同意なく第三者に提供することはありません｡なお､本人の求めによる個人情報の開示､訂正､追加若しくは削除又は利用目的の通知については､法令に従いこれを行うとともに､ご意見､ご相談に関して適切に対応します｡
    </p>

    <h3>3.個人情報の利用目的の変更</h3>
    <p>
      当社は､前項で特定した利用目的は､予め本人の同意を得た場合を除くほかは､原則として変更しません｡但し､変更前の利用目的と相当の関連性を有すると合理的に認められる範囲において､予め変更後の利用目的を公表の上で変更を行う場合はこの限りではありません｡
    </p>
    <h3>4.個人情報の第三者提供</h3>
    <p>
      当社は､個人情報の取扱いの全部又は一部を第三者に委託する場合､その適格性を十分に審査し､その取扱いを委託された個人情報の安全管理が図られるよう､委託を受けた者に対する必要かつ適切な監督を行うこととします｡
    </p>
    <h3>5.個人情報の取扱いの改善・見直し</h3>
    <p>
      当社は､個人情報の取扱い､管理体制及び取組みに関する点検を実施し､継続的に改善･見直しを行います｡
    </p>
    <h3>6.個人情報の廃棄</h3>
    <p>
      当社は､個人情報の利用目的に照らしその必要性が失われたときは､個人情報を消去又は廃棄するものとし､当該消去及び廃棄は､外部流失等の危険を防止するために必要かつ適切な方法により､業務の遂行上必要な限りにおいて行います｡
    </p>
    <h3>7.本サイトの管理者</h3>
    <p>
      本ポリシーへのお問い合わせは､以下よりお願いいたします｡
    </p>
    <table>
      <tr>
        <td>運営者</td>
        <td>株式会社 信成堂</td>
      </tr>
      <tr>
        <td>所在地</td>
        <td>
          〒989-0851
          <br class="none-pc" />
          宮城県刈田郡蔵王町曲竹神西4-4
        </td>
      </tr>
      <tr>
        <td>電話番号</td>
        <td class="tel">
          <a href="tel:0224-26-9441">0224-26-9441</a>
        </td>
      </tr>
      <tr>
        <td>代表者</td>
        <td>我妻 成</td>
      </tr>
    </table>
  </div>
</template>

<style lang="scss" scoped>
.policy {
  max-width: 994px;
  width: 90%;
  margin: 0 auto;
  padding: 200px 0 160px;

  @media screen and (max-width: 1180px) {
    padding: 80px 0 96px;
  }

  .none-pc {
    display: none;

    @media screen and (max-width: 1180px) {
      display: block;
    }
  }

  p {
    font-size: 18px;
    line-height: 1.6;
    letter-spacing: 0.071em;
    text-align: justify;
  }

  h2 {
    margin-bottom: 48px;
    font-size: 32px;
    font-weight: bold;

    @media screen and (max-width: 1180px) {
      margin-bottom: 40px;
      font-size: 26px;
    }

    & + p {
      margin-bottom: 40px;
    }
  }

  h3 {
    margin-bottom: 8px;
    font-size: 24px;
    font-weight: bold;

    @media screen and (max-width: 1180px) {
      font-size: 22px;
    }

    & + p {
      margin-bottom: 40px;
    }

    &:nth-of-type(2) {
      & + p {
        margin-bottom: 24px;
      }
    }

    &:last-of-type {
      & + p {
        margin-bottom: 16px;

        @media screen and (max-width: 1180px) {
          margin-bottom: 8px;
        }
      }
    }
  }

  h4 {
    margin-bottom: 8px;
    font-size: 18px;
    font-weight: bold;

    & + p {
      margin-bottom: 24px;
    }

    &:last-of-type {
      & + p {
        margin-bottom: 40px;
      }
    }
  }

  table {
    font-size: 22px;
    line-height: 1.3;

    tr {
      td {
        @media screen and (max-width: 1180px) {
          display: block;
          width: 100%;
          font-size: 20px;
          line-height: 1.45;
        }

        @media screen and (max-width: 1180px) {
          &:last-of-type {
            padding-left: 20px;
          }
        }
      }
    }

    .tel {
      padding-left: 22px;

      @media screen and (max-width: 1180px) {
        padding-left: 0;
      }

      a {
        pointer-events: none;

        @media screen and (max-width: 1180px) {
          pointer-events: auto;
        }
      }
    }
  }
}
</style>
