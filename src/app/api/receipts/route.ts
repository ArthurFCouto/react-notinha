import { ReceiptController } from '@/server/controllers/receipt';
import { NextResponse } from 'next/server';

/*
 * api/receipts {url: strings}
 */
export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => undefined);
    const url = body ? body.url : body;
    if (!url)
      return NextResponse.json(
        { error: 'Favor enviar no corpo da requisição [url]' },
        { status: 400 }
      );
    const response = await ReceiptController.CreateReceipt(url);
    return NextResponse.json(response);
  } catch (error: any) {
    return ErrorMapping(error);
  }
}

/*
 * api/receipts?offset=string&quantidadePorPagina=number&carregarBase=true
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const offset = searchParams.get('offset') ?? '';
    const amount = parseInt(String(searchParams.get('quantidadePorPagina')));
    const perPage = isNaN(amount) ? 50 : amount;
    const response = await ReceiptController.GetAllReceipts(offset, perPage);
    return NextResponse.json(response);
  } catch (error) {
    return ErrorMapping(error);
  }
}

/*
 * api/receipts?chaves=string;string
 */
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const keys = searchParams.get('chaves');
    if (keys) {
      const response = await ReceiptController.DeleteListByKeyList(
        keys.split(';')
      );
      return NextResponse.json({ response });
    }
    return NextResponse.json(
      { error: 'Favor enviar o parametro [chaves]' },
      { status: 400 }
    );
  } catch (error) {
    return ErrorMapping(error);
  }
}

const ErrorMapping = (error: any) => {
  let status = 500;
  if (typeof error == 'string' || error instanceof String) {
    const regex = /^(\d{3}) - (.+)/;
    const match = error.match(regex);
    status = match ? parseInt(match[1]) : 500;
    error = match ? match[2] : error;
  }
  return NextResponse.json({ error }, { status: status });
};

const urlsProd = [
  'https://portalsped.fazenda.mg.gov.br/portalnfce/sistema/qrcode.xhtml?p=31240402274225000161650040003195201165010981|2|1|1|641c767ef4f193bcb2a1e919210842158f832e80',
  'https://portalsped.fazenda.mg.gov.br/portalnfce/sistema/qrcode.xhtml?p=31240402274225000161650060002641121203294580|2|1|1|1db0595783faa2997d7535cdfb49ffb681a50dda',
  'https://portalsped.fazenda.mg.gov.br/portalnfce/sistema/qrcode.xhtml?p=31240502274225000161650040003217001204755066|2|1|1|8268d27ac527d60de354e822d3847ca9fcff9003',
  'https://portalsped.fazenda.mg.gov.br/portalnfce/sistema/qrcode.xhtml?p=31240502274225000161650040003219851173286530|2|1|1|c937ca6279518f6c5c3bc740057d0fbafdd3b69f',
  'https://portalsped.fazenda.mg.gov.br/portalnfce/sistema/qrcode.xhtml?p=31240502274225000161650040003235861149757654|2|1|1|d1ca47d639972e28bf31aafb6b44aa1948a25d48',
  'https://portalsped.fazenda.mg.gov.br/portalnfce/sistema/qrcode.xhtml?p=31240502274225000161650040003262241114806548|2|1|1|1cf5c57263e6a9c6a39e155dd6c453ba80956f4f',
  'https://portalsped.fazenda.mg.gov.br/portalnfce/sistema/qrcode.xhtml?p=31240502274225000161650050002323961314056040|2|1|1|c15787504709afc38186411d90e9c315316f3629',
  'https://portalsped.fazenda.mg.gov.br/portalnfce/sistema/qrcode.xhtml?p=31240502274225000161650050002328981178750190|2|1|1|d6d8b79b04a8ba3fd03f3528c337a8212588e4df',
  'https://portalsped.fazenda.mg.gov.br/portalnfce/sistema/qrcode.xhtml?p=31240502274225000161650050002330161830154782|2|1|1|efb1800cb7652f49756b183ef942dc84124fdc3e',
  'https://portalsped.fazenda.mg.gov.br/portalnfce/sistema/qrcode.xhtml?p=31240502274225000161650050002332181109727950|2|1|1|128992ebdda363d1ac35397661c48d2486cccfd8',
  'https://portalsped.fazenda.mg.gov.br/portalnfce/sistema/qrcode.xhtml?p=31240502274225000161650050002336731163329847|2|1|1|b06268f1870f12e547e334f0c49564b18c900596',
  'https://portalsped.fazenda.mg.gov.br/portalnfce/sistema/qrcode.xhtml?p=31240502274225000161650050002341191264549055|2|1|1|bc10d3095d5c76ae4ce1c8a306e16e460990bbc5',
  'https://portalsped.fazenda.mg.gov.br/portalnfce/sistema/qrcode.xhtml?p=31240502274225000161650060002663641256820902|2|1|1|e36cdc053b3b2922eb81e63e4cb09cd09271cc20',
  'https://portalsped.fazenda.mg.gov.br/portalnfce/sistema/qrcode.xhtml?p=31240502274225000161650060002704471110352034|2|1|1|ec8072fae92d2d3ccb75a1648be257a1e1db5109',
  'https://portalsped.fazenda.mg.gov.br/portalnfce/sistema/qrcode.xhtml?p=31240502274225000161650060002705371244242089|2|1|1|a10bb7bcbb90a2ded9e5d7a9d522c06426397741',
  'https://portalsped.fazenda.mg.gov.br/portalnfce/sistema/qrcode.xhtml?p=31240502274225000161650060002706009734690178|2|1|22|40.79|4d6273357141724543624a625476356e4e4e7178706f4c4d3477383d|1|e13f9786e2ab0f7d496e8b14cb487470df9fdb2d',
  'https://portalsped.fazenda.mg.gov.br/portalnfce/sistema/qrcode.xhtml?p=31240502274225000161650060002710101112100043|2|1|1|0eadc3dc0cb5960900eb19ecd5c89f00e1b6a6d1',
  'https://portalsped.fazenda.mg.gov.br/portalnfce/sistema/qrcode.xhtml?p=31240602274225000161650040003274431807746699|2|1|1|b8c056a83232d3b5eae81417e191275d3473f9a1',
  'https://portalsped.fazenda.mg.gov.br/portalnfce/sistema/qrcode.xhtml?p=31240602274225000161650040003289351942682687|2|1|1|33418840f0d92eaa78da86a75b28ac0e25113b15',
  'https://portalsped.fazenda.mg.gov.br/portalnfce/sistema/qrcode.xhtml?p=31240602274225000161650040003295961208515396|2|1|1|48954dbd06e4b87f9e5ccc4e9241632b6604a023',
  'https://portalsped.fazenda.mg.gov.br/portalnfce/sistema/qrcode.xhtml?p=31240602274225000161650040003304941166530603|2|1|1|cf48cec128703d01b3bab55438239a809b4833b7',
  'https://portalsped.fazenda.mg.gov.br/portalnfce/sistema/qrcode.xhtml?p=31240602274225000161650040003304961166543718|2|1|1|05d08777e174950a101d715a99f76ff5c8bbcbb6',
  'https://portalsped.fazenda.mg.gov.br/portalnfce/sistema/qrcode.xhtml?p=31240602274225000161650040003304971166550274|2|1|1|4c7ed595d6ae4ae04073591ad0c09c06622c97fc',
  'https://portalsped.fazenda.mg.gov.br/portalnfce/sistema/qrcode.xhtml?p=31240602274225000161650040003304981166504393|2|1|1|d32ca6ea36893b33e8a0a68f604e343fbeedb926',
  'https://portalsped.fazenda.mg.gov.br/portalnfce/sistema/qrcode.xhtml?p=31240602274225000161650050002348761623407715|2|1|1|76fd9d868a3fb15ebb43e47f045ad8771d2bf38c',
  'https://portalsped.fazenda.mg.gov.br/portalnfce/sistema/qrcode.xhtml?p=31240602274225000161650050002363721181413530|2|1|1|792fa964e7ae56c8e7264e52c7b8c3dacb731c81',
  'https://portalsped.fazenda.mg.gov.br/portalnfce/sistema/qrcode.xhtml?p=31240602274225000161650050002379621202111589|2|1|1|a070b6dc60751fb63103b42e2f7e4c96d15a9c64',
  'https://portalsped.fazenda.mg.gov.br/portalnfce/sistema/qrcode.xhtml?p=31240602274225000161650060002741041183536150|2|1|1|5db44fc1716d56b1567a360e7656aa1b9f043f5b',
  'https://portalsped.fazenda.mg.gov.br/portalnfce/sistema/qrcode.xhtml?p=31240602274225000161650060002747181165600338|2|1|1|ea6e9d4439c984c04ec04ff9b598c3424263c509',
  'https://portalsped.fazenda.mg.gov.br/portalnfce/sistema/qrcode.xhtml?p=31240602274225000161650060002757411110581121|2|1|1|79856d6f1e8689cea47451549dc7e0ef63e1207e',
  'https://portalsped.fazenda.mg.gov.br/portalnfce/sistema/qrcode.xhtml?p=31240602274225000161650060002763921182068554|2|1|1|2245d052154871840d9a43a00e5d83cb5408a0d0',
  'https://portalsped.fazenda.mg.gov.br/portalnfce/sistema/qrcode.xhtml?p=31240602274225000161650060002768451348091620|2|1|1|ec3de73e864303387ce54252802419b84469b170',
  'https://portalsped.fazenda.mg.gov.br/portalnfce/sistema/qrcode.xhtml?p=31240602274225000161650060002776301526861703|2|1|1|c2809c2b734ba39da4b424140c1f9f904c43f8d1',
  'https://portalsped.fazenda.mg.gov.br/portalnfce/sistema/qrcode.xhtml?p=31240602274225000161650080000314881108403798|2|1|1|dee9d7f1601d0c8ed7e49aefe4295c56a9475a3a',
  'https://portalsped.fazenda.mg.gov.br/portalnfce/sistema/qrcode.xhtml?p=31240602274225000161650080000317291682302317|2|1|1|1b513385f0cf5b72b43d260540867d02d2af12a3',
  'https://portalsped.fazenda.mg.gov.br/portalnfce/sistema/qrcode.xhtml?p=31240602274225000161650080000320731847884036|2|1|1|142679e8619742203e473ef29192af4aa8a811fe',
  'https://portalsped.fazenda.mg.gov.br/portalnfce/sistema/qrcode.xhtml?p=31240602274225000161650080000335581123247292|2|1|1|def24ed3143bb35287a9b5418bee80b4b6b9bea8',
  'https://portalsped.fazenda.mg.gov.br/portalnfce/sistema/qrcode.xhtml?p=31240602274225000161650080000345591193131333|2|1|1|2d6a27d7ce85cad5c3a17ba8c8b9206a82de44ce',
  'https://portalsped.fazenda.mg.gov.br/portalnfce/sistema/qrcode.xhtml?p=31240602274225000161650080000365741208152552|2|1|1|111792a8773beb8b8eabaf0fd550ccde5f56f34b',
  'https://portalsped.fazenda.mg.gov.br/portalnfce/sistema/qrcode.xhtml?p=31240702274225000161650040003334231192296537|2|1|1|d1e7e002cfbced0e6abe257be315219c3e01825b',
  'https://portalsped.fazenda.mg.gov.br/portalnfce/sistema/qrcode.xhtml?p=31240702274225000161650040003343161153887834|2|1|1|58f20427be4f23d62e698cc551f7db839f2e886e',
  'https://portalsped.fazenda.mg.gov.br/portalnfce/sistema/qrcode.xhtml?p=31240702274225000161650050002401751704223278|2|1|1|d008f134b7af87d42a04ecb6bec49cf9914e409f',
  'https://portalsped.fazenda.mg.gov.br/portalnfce/sistema/qrcode.xhtml?p=31240702274225000161650050002418251104509384|2|1|1|fa1599c02b2b03203fd4b002d5794e79cf2ff8d0',
  'https://portalsped.fazenda.mg.gov.br/portalnfce/sistema/qrcode.xhtml?p=31240702274225000161650060002796011180132467|2|1|1|dea45aad368815f0d4217c5455ec18b1def86f8f',
  'https://portalsped.fazenda.mg.gov.br/portalnfce/sistema/qrcode.xhtml?p=31240702274225000161650080000375501122460875|2|1|1|e82ea83014140e215646ae033d095352c1f38a3e',
  'https://portalsped.fazenda.mg.gov.br/portalnfce/sistema/qrcode.xhtml?p=31240702274225000161650080000388981162719378|2|1|1|038b6e29f043c43fd205ac91aec72c609f0bc45b',
  'https://portalsped.fazenda.mg.gov.br/portalnfce/sistema/qrcode.xhtml?p=31240702274225000161650080000407961150776999|2|1|1|eff717d8ffd6312b8810c45b8a44d4c5ef37e964',
  'https://portalsped.fazenda.mg.gov.br/portalnfce/sistema/qrcode.xhtml?p=31240702274225000161650080000418211104536572|2|1|1|93c961505121fb8e6d65463bba7b611f658581c2',
  'https://portalsped.fazenda.mg.gov.br/portalnfce/sistema/qrcode.xhtml?p=31240702274225000161650080000427021122570705|2|1|1|72976b3f9104ef7564d2e1ea6e05c1355e979b1b',
  'https://portalsped.fazenda.mg.gov.br/portalnfce/sistema/qrcode.xhtml?p=31240802274225000161650040003355351808952174|2|1|1|29f6b60dddcf9939eece88c0914ac8f75b9ba7a0',
  'https://portalsped.fazenda.mg.gov.br/portalnfce/sistema/qrcode.xhtml?p=31240802274225000161650040003361381155448632|2|1|1|347c443aa9408896f90b4e7e520873ecd8c72c10',
  'https://portalsped.fazenda.mg.gov.br/portalnfce/sistema/qrcode.xhtml?p=31240802274225000161650040003379131108044660|2|1|1|a511201ac97e740dc173c38313bff77716dd9889',
  'https://portalsped.fazenda.mg.gov.br/portalnfce/sistema/qrcode.xhtml?p=31240802274225000161650040003385021186376089|2|1|1|3322bc7a77026797f443916d55aa2cdfee1ae2b4',
  'https://portalsped.fazenda.mg.gov.br/portalnfce/sistema/qrcode.xhtml?p=31240802274225000161650040003391881142023030|2|1|1|d347ca817685a23118a88b4d347cd46aa7610e43',
  'https://portalsped.fazenda.mg.gov.br/portalnfce/sistema/qrcode.xhtml?p=31240802274225000161650040003399701180309220|2|1|1|e4288bd96cda34a91eb842d283e2de9bc474b949',
  'https://portalsped.fazenda.mg.gov.br/portalnfce/sistema/qrcode.xhtml?p=31240802274225000161650050002433351286339856|2|1|1|221700c1a8c219764ff5361961d78b2583ea596d',
  'https://portalsped.fazenda.mg.gov.br/portalnfce/sistema/qrcode.xhtml?p=31240802274225000161650050002449771197068994|2|1|1|4a96c67ae89ec6fbf0d031c22d5216f6b41056c7',
  'https://portalsped.fazenda.mg.gov.br/portalnfce/sistema/qrcode.xhtml?p=31240802274225000161650080000461381153620625|2|1|1|4808248a480b3036b0d7ae4916d58b7eb45eb526',
  'https://portalsped.fazenda.mg.gov.br/portalnfce/sistema/qrcode.xhtml?p=31240802274225000161650080000480321121363910|2|1|1|7694ac58844d2fcc81540a9aa6538e8ada628fb4',
  'https://portalsped.fazenda.mg.gov.br/portalnfce/sistema/qrcode.xhtml?p=31240802274225000161650080000480331121370477|2|1|1|bc177a71ef58d0c8b57d7033a8ea5868334186c8',
  'https://portalsped.fazenda.mg.gov.br/portalnfce/sistema/qrcode.xhtml?p=31240802274225000161650080000488771142846460|2|1|1|76631ca96234cab93b4a2ea1e6f07b682ad1b3ea',
  'https://portalsped.fazenda.mg.gov.br/portalnfce/sistema/qrcode.xhtml?p=31240802274225000161650080000497181598610034|2|1|1|02d5451f16d4afb88fe29da35303ed8cbba5a115',
  'https://portalsped.fazenda.mg.gov.br/portalnfce/sistema/qrcode.xhtml?p=31240902274225000161650040003404751114225540|2|1|1|672c6a50cdd92ff2b36621972c25eafc2b26d0fb',
  'https://portalsped.fazenda.mg.gov.br/portalnfce/sistema/qrcode.xhtml?p=31240902274225000161650040003406991140977335|2|1|1|c7183482c39a3eb8e0626829cf6bc3570f4927d9',
  'https://portalsped.fazenda.mg.gov.br/portalnfce/sistema/qrcode.xhtml?p=31240902274225000161650040003419701121554249|2|1|1|105ccababc34eb8d2934ebc233991cd03af9c60b',
  'https://portalsped.fazenda.mg.gov.br/portalnfce/sistema/qrcode.xhtml?p=31240902274225000161650040003436101162117921|2|1|1|9a02a39ebf23da961b1a6bbfb83fe022d7b6b4ba',
  'https://portalsped.fazenda.mg.gov.br/portalnfce/sistema/qrcode.xhtml?p=31240902274225000161650040003439611933283002|2|1|1|9bc02c4f23c74fdf317a4ab1f8f1913a843f4ebb',
  'https://portalsped.fazenda.mg.gov.br/portalnfce/sistema/qrcode.xhtml?p=31240902274225000161650040003441431130536633|2|1|1|0474d1bf2e84100165ed89fcb7a4d10ad085521c',
  'https://portalsped.fazenda.mg.gov.br/portalnfce/sistema/qrcode.xhtml?p=31240902274225000161650040003449581233787228|2|1|1|573500ae09660599cc2de6cdeb1061260ff8ff0e',
  'https://portalsped.fazenda.mg.gov.br/portalnfce/sistema/qrcode.xhtml?p=31240902274225000161650050002473731145826834|2|1|1|670e83712b580d41e241f55e3e1e7d18dcdde9f0',
  'https://portalsped.fazenda.mg.gov.br/portalnfce/sistema/qrcode.xhtml?p=31240902274225000161650050002483151120938060|2|1|1|57f212bc18721501217fc91bbd2c03aceaf7be0e',
  'https://portalsped.fazenda.mg.gov.br/portalnfce/sistema/qrcode.xhtml?p=31240902274225000161650050002484991126898511|2|1|1|0d590925c1577f71ae1760c574fd7f8d1ef964d0',
  'https://portalsped.fazenda.mg.gov.br/portalnfce/sistema/qrcode.xhtml?p=31240902274225000161650050002485521146907574|2|1|1|9f89f0a3be3b95516127d54e6fa7eb111bd4ea7d',
  'https://portalsped.fazenda.mg.gov.br/portalnfce/sistema/qrcode.xhtml?p=31240902274225000161650050002489991146010068|2|1|1|1256a6be7ae9c0d7ff5b57df60fc0b783a2dc2ac',
  'https://portalsped.fazenda.mg.gov.br/portalnfce/sistema/qrcode.xhtml?p=31240902274225000161650050002505621127011270|2|1|1|e3f1d5cd4507f0d1fa4f8a1a0b0e9b8c2539d995',
  'https://portalsped.fazenda.mg.gov.br/portalnfce/sistema/qrcode.xhtml?p=31240902274225000161650080000504371113589394|2|1|1|a5e3b26bb0c8bc5d651086c83ddbbbd5a20bbd4e',
  'https://portalsped.fazenda.mg.gov.br/portalnfce/sistema/qrcode.xhtml?p=31240902274225000161650080000520651317877659|2|1|1|2a95123eb267080530b3b16fccd410e2a99e921e',
  'https://portalsped.fazenda.mg.gov.br/portalnfce/sistema/qrcode.xhtml?p=31240902274225000161650080000527981125491131|2|1|1|a4e872916d874ebd53efeee2eb870ca2000c9a82',
  'https://portalsped.fazenda.mg.gov.br/portalnfce/sistema/qrcode.xhtml?p=31241002274225000161650040003453679704548526|2|1|03|15.96|5a3255696933585541347734552b513759565a4b51716633422f6b3d|1|d2abafd09ae09cec2a9521a1047680c8e0a1351b',
  'https://portalsped.fazenda.mg.gov.br/portalnfce/sistema/qrcode.xhtml?p=31241002274225000161650040003467301194173926|2|1|1|dbf509756a32f674a6421ad0a974b22ab98a2543',
  'https://portalsped.fazenda.mg.gov.br/portalnfce/sistema/qrcode.xhtml?p=31241002274225000161650040003486701396224199|2|1|1|77864243c88c6fa9b46ff61904855a3603413ba1',
  'https://portalsped.fazenda.mg.gov.br/portalnfce/sistema/qrcode.xhtml?p=31241002274225000161650040003495861180808400|2|1|1|51293717f7b9b5804e40ad0ce4058ee5c22a5650',
  'https://portalsped.fazenda.mg.gov.br/portalnfce/sistema/qrcode.xhtml?p=31241002274225000161650040003499381201010236|2|1|1|21d6bef6f986264eca0981a3b2ec5f701df20d54',
  'https://portalsped.fazenda.mg.gov.br/portalnfce/sistema/qrcode.xhtml?p=31241002274225000161650050002532601203508692|2|1|1|a0a7af2dd97721ab069c5e7b03e0488d156eb60c',
  'https://portalsped.fazenda.mg.gov.br/portalnfce/sistema/qrcode.xhtml?p=31241002274225000161650060002993931157057969|2|1|1|ed55f4325c2cc28dd1b328964ae51fece177b513',
  'https://portalsped.fazenda.mg.gov.br/portalnfce/sistema/qrcode.xhtml?p=31241002274225000161650060003028141624447785|2|1|1|0412cdffaad10eaf961e725011f9d380a181ef4c',
  'https://portalsped.fazenda.mg.gov.br/portalnfce/sistema/qrcode.xhtml?p=31241102274225000161650040003507691159954008|2|1|1|f42a91650379241b390c742094895b246b18e05d',
  'https://portalsped.fazenda.mg.gov.br/portalnfce/sistema/qrcode.xhtml?p=31241102274225000161650040003532611100595867|2|1|1|88cf87dc1f5c7b3467b427d77d9ab3f1fdbb10ee',
  'https://portalsped.fazenda.mg.gov.br/portalnfce/sistema/qrcode.xhtml?p=31241102274225000161650040003538301195017374|2|1|1|7582b93fbd3dfff2f37b24c5ac0d2d5bcd964dc9',
  'https://portalsped.fazenda.mg.gov.br/portalnfce/sistema/qrcode.xhtml?p=31241102274225000161650040003540891197212032|2|1|1|d0c051b6663dd0c79e78e18a598961d19cf5924e',
  'https://portalsped.fazenda.mg.gov.br/portalnfce/sistema/qrcode.xhtml?p=31241102274225000161650040003543101157090900|2|1|1|f75566a4b2b5f0efd41afc3076041b01698855c9',
  'https://portalsped.fazenda.mg.gov.br/portalnfce/sistema/qrcode.xhtml?p=31241102274225000161650040003544231143721559|2|1|1|6728a9879536c20d587223ed208dd245d1c73f36',
  'https://portalsped.fazenda.mg.gov.br/portalnfce/sistema/qrcode.xhtml?p=31241102274225000161650040003547711103541430|2|1|1|04990d8ed3798e6260b5ef808a22751722dd2dc4',
  'https://portalsped.fazenda.mg.gov.br/portalnfce/sistema/qrcode.xhtml?p=31241102274225000161650040003547721103547982|2|1|1|1473be7ecdf76c8e2e66a23368d1098d0c85fbea',
  'https://portalsped.fazenda.mg.gov.br/portalnfce/sistema/qrcode.xhtml?p=31241102274225000161650050002556351376442199|2|1|1|50e6199a09d5cc228354ddd05c30c1f3aff71a4c',
  'https://portalsped.fazenda.mg.gov.br/portalnfce/sistema/qrcode.xhtml?p=31241102274225000161650080000640441197081409|2|1|1|359b7492ae0367617b299133f30d873ba0077993',
  'https://portalsped.fazenda.mg.gov.br/portalnfce/sistema/qrcode.xhtml?p=31241102274225000161650080000646541116747370|2|1|1|5e6f7454b3ea2d73c32ee03b46b7233b98cd4a77',
  'https://portalsped.fazenda.mg.gov.br/portalnfce/sistema/qrcode.xhtml?p=31241202274225000161650040003562311660683344|2|1|1|54c38e042344dc7f37b901bc1f3c5bb912c91945',
  'https://portalsped.fazenda.mg.gov.br/portalnfce/sistema/qrcode.xhtml?p=31241202274225000161650040003568051127256991|2|1|1|ce3d4e87eef95f42755f2f86936846fd9de98127',
  'https://portalsped.fazenda.mg.gov.br/portalnfce/sistema/qrcode.xhtml?p=31241202274225000161650050002608261156616470|2|1|1|46e3f0d8b42bbade6624ab8d0cff53601f83ddf3',
  'https://portalsped.fazenda.mg.gov.br/portalnfce/sistema/qrcode.xhtml?p=31250102274225000161650040003617781276387637|2|1|1|b4076144e0674b24160e808454f128e69fe8f34f',
  'https://portalsped.fazenda.mg.gov.br/portalnfce/sistema/qrcode.xhtml?p=31250102274225000161650040003625001183628929|2|1|1|ef43e400a0528f69be73223669f3586b98624659',
  'https://portalsped.fazenda.mg.gov.br/portalnfce/sistema/qrcode.xhtml?p=31250102274225000161650060003208519266339193|2|1|18|59.05|514547794d2b5858725a507736643356764e54744e6d39696841733d|1|84d8594bba9c9e1bae58e37a059dd5ee13c6a685',
  'https://portalsped.fazenda.mg.gov.br/portalnfce/sistema/qrcode.xhtml?p=31250102274225000161650080000728641358988788|2|1|1|f3a6946c73b32ba23ad010e788809b90f4825285',
  'https://portalsped.fazenda.mg.gov.br/portalnfce/sistema/qrcode.xhtml?p=31250102274225000161650080000734241419788403|2|1|1|cfcf825a7f4959c0feb011b5eb79c40b89ce8818',
  'https://portalsped.fazenda.mg.gov.br/portalnfce/sistema/qrcode.xhtml?p=31250102274225000161650080000745051211403872|2|1|1|39c205da2b27f1cf09b187510d83b6d173bac53c',
  'https://portalsped.fazenda.mg.gov.br/portalnfce/sistema/qrcode.xhtml?p=31240403111258000153650140001028831133159854|2|1|1|9770CECA91303C7A350860AE5ED15386163E268E',
  'https://portalsped.fazenda.mg.gov.br/portalnfce/sistema/qrcode.xhtml?p=31240403111258000153650140001043801889016202|2|1|1|5918C21E87DC2BD385AE1013A751146C712B2379',
  'https://portalsped.fazenda.mg.gov.br/portalnfce/sistema/qrcode.xhtml?p=31240421560153000163650040001367649023640840|2|1|20|42.19|7047326F753335396D342B66684D663157546369453679664C64633D|1|EC3D7C78FA5A70F6CE73EBCCC676B3BA185DC416',
  'https://portalsped.fazenda.mg.gov.br/portalnfce/sistema/qrcode.xhtml?p=31240503111258000153650120001114521284740434|2|1|1|DE4DA9F317839064ECA4A9A32088B29BE785B738',
  'https://portalsped.fazenda.mg.gov.br/portalnfce/sistema/qrcode.xhtml?p=31240503111258000153650120001153331649693047|2|1|1|F8A1810957D3A6A5E099803D130BB09F768D1AB2',
  'https://portalsped.fazenda.mg.gov.br/portalnfce/sistema/qrcode.xhtml?p=31240503111258000153650160000955431663696391|2|1|1|00353286E1AEE9BB65C84DE432092258BF70C731',
  'https://portalsped.fazenda.mg.gov.br/portalnfce/sistema/qrcode.xhtml?p=31240503111258000153650160000966041470583716|2|1|1|E96DF0CFCC91AE293E899ACFF9635668CF0C4195',
  'https://portalsped.fazenda.mg.gov.br/portalnfce/sistema/qrcode.xhtml?p=31240503111258000153650160000967941046630543|2|1|1|853946743B3D264F5E13D86221D8D7A9F300568F',
  'https://portalsped.fazenda.mg.gov.br/portalnfce/sistema/qrcode.xhtml?p=31240503111258000153650160000983061066016896|2|1|1|7E59E1356AE8B34F443147CC757EA3AE7697A24B',
  'https://portalsped.fazenda.mg.gov.br/portalnfce/sistema/qrcode.xhtml?p=31240503111258000153650160000995181671654290|2|1|1|C28D63261E1BECB314585CA0DF5E68EB285B1E1D',
  'https://portalsped.fazenda.mg.gov.br/portalnfce/sistema/qrcode.xhtml?p=31240503111258000153650160000999531083477984|2|1|1|DE28B7F4AB164E74114F79A78C35BA8FF74A234A',
  'https://portalsped.fazenda.mg.gov.br/portalnfce/sistema/qrcode.xhtml?p=31240503111258000153650160001007731849748534|2|1|1|46C6CB4B6C470CC1D558FBBC89460F90E1570293',
  'https://portalsped.fazenda.mg.gov.br/portalnfce/sistema/qrcode.xhtml?p=31240503111258000153650170001244411356947809|2|1|1|127E688BDF4DE5FC0BBDD3A35E5D5087A58BBFB1',
  'https://portalsped.fazenda.mg.gov.br/portalnfce/sistema/qrcode.xhtml?p=31240521560153000163650040001437741144402766|2|1|1|EA98D8739DC02DF65CBF48810426ACFFA8FB76FE',
  'https://portalsped.fazenda.mg.gov.br/portalnfce/sistema/qrcode.xhtml?p=31240521560153000163650050000801851159654559|2|1|1|20F18AF9BB929CD9914C234316947B9E44881EF1',
  'https://portalsped.fazenda.mg.gov.br/portalnfce/sistema/qrcode.xhtml?p=31240521560153000163650060000582621605814762|2|1|1|53664AD48423AF39DE4194F05FB276C29241BC26',
  'https://portalsped.fazenda.mg.gov.br/portalnfce/sistema/qrcode.xhtml?p=31240525834847003541651370000382361689932910|2|1|1|2346EBEC1A1DDA94A3E0E80AA7938AA575CC2BC5',
  'https://portalsped.fazenda.mg.gov.br/portalnfce/sistema/qrcode.xhtml?p=31240525834847003541651370000395789259961120|2|1|18|14.64|714a78454253314162383557564a6d585a6f662b772f37415346343d|1|AAD86681779F6959C09C536F1A8EFB42BC3DDEB8',
  'https://portalsped.fazenda.mg.gov.br/portalnfce/sistema/qrcode.xhtml?p=31240525834847003541651390000306311070547663|2|1|1|08C2604D2B0E01D3FF09FA64FFC912CC748E8EA2',
  'https://portalsped.fazenda.mg.gov.br/portalnfce/sistema/qrcode.xhtml?p=31240525834847003541651390000330401450823980|2|1|1|1F5DEA6082549AC830ACADABE677F482D23075C6',
  'https://portalsped.fazenda.mg.gov.br/portalnfce/sistema/qrcode.xhtml?p=31240525834847003541651400000379449794945270|2|1|07|22.30|72667348416f72526e686a6d544d6a6a4738394d4e3941715831513d|1|62C51E0EB0D6205A7D524A1013A044AE0319EAD8',
  'https://portalsped.fazenda.mg.gov.br/portalnfce/sistema/qrcode.xhtml?p=31240603111258000153650120001159851664826624|2|1|1|2CA10AE634E7016B4ECA5484653B1ABCFAB36527',
  'https://portalsped.fazenda.mg.gov.br/portalnfce/sistema/qrcode.xhtml?p=31240603111258000153650120001177001319822637|2|1|1|57A0662089C9248F3E0B08DDE96F8E7569040837',
  'https://portalsped.fazenda.mg.gov.br/portalnfce/sistema/qrcode.xhtml?p=31240603111258000153650120001187821313960850|2|1|1|10EAE35887C56930DF8FF2B26E5A3726CE047F24',
  'https://portalsped.fazenda.mg.gov.br/portalnfce/sistema/qrcode.xhtml?p=31240603111258000153650140001134161831742424|2|1|1|EC8954FB508EA016A705F5106FEED730524315EA',
  'https://portalsped.fazenda.mg.gov.br/portalnfce/sistema/qrcode.xhtml?p=31240603111258000153650160001034011209061989|2|1|1|E9EF4916BD3D39C1172F8FEBAA005591CDF9A59D',
  'https://portalsped.fazenda.mg.gov.br/portalnfce/sistema/qrcode.xhtml?p=31240603111258000153650160001045711086889407|2|1|1|DCDBD8E257470C5F3AE5064B04D736C1C33F8CBA',
  'https://portalsped.fazenda.mg.gov.br/portalnfce/sistema/qrcode.xhtml?p=31240603111258000153650160001045721306658945|2|1|1|CCC0F07888EFE946CC42DEE6E87548B45D624F9D',
  'https://portalsped.fazenda.mg.gov.br/portalnfce/sistema/qrcode.xhtml?p=31240603111258000153650170001287901424458220|2|1|1|368BB08DB00CB9C50566579726395F9D2E958E47',
  'https://portalsped.fazenda.mg.gov.br/portalnfce/sistema/qrcode.xhtml?p=31240603111258000153650170001321591117354153|2|1|1|E67F8AE8FE50CD74907D32289D691C203540B834',
  'https://portalsped.fazenda.mg.gov.br/portalnfce/sistema/qrcode.xhtml?p=31240603111258000153650170001341871100353624|2|1|1|3CABB77B19C634BB8636D2B3B9BA8BA26EA40A63',
  'https://portalsped.fazenda.mg.gov.br/portalnfce/sistema/qrcode.xhtml?p=31240621560153000163650020001583081788345629|2|1|1|8D1592D98481C73D50FBA52F679E09B6F4A2C72B',
  'https://portalsped.fazenda.mg.gov.br/portalnfce/sistema/qrcode.xhtml?p=31240621560153000163650020001583091810461603|2|1|1|201B6A56A5B2BCDC2164E899106EE519688ACC3F',
  'https://portalsped.fazenda.mg.gov.br/portalnfce/sistema/qrcode.xhtml?p=31240621560153000163650040001453281783437817|2|1|1|28495E2E6FC162F2C94F06D31A771D809827D2B9',
  'https://portalsped.fazenda.mg.gov.br/portalnfce/sistema/qrcode.xhtml?p=31240621560153000163650040001453291791441736|2|1|1|3F47459472633FB84257EDDB9C876362E7F110DD',
  'https://portalsped.fazenda.mg.gov.br/portalnfce/sistema/qrcode.xhtml?p=31240621560153000163650060000623691541524307|2|1|1|EBA1A5BE2D8C21A03DAA55E49CC22187AB035C13',
  'https://portalsped.fazenda.mg.gov.br/portalnfce/sistema/qrcode.xhtml?p=31240621560153000163650060000634261102263374|2|1|1|D8DA31B1186C1BFB4A4AF3ADEB402FB52C1906AE',
  'https://portalsped.fazenda.mg.gov.br/portalnfce/sistema/qrcode.xhtml?p=31240621560153000163650060000635551936679362|2|1|1|65A701671EED297A861FE89A808DEFB3F2B51849',
  'https://portalsped.fazenda.mg.gov.br/portalnfce/sistema/qrcode.xhtml?p=31240625834847003541651370000420721927555277|2|1|1|001C156D0A9145EA1F09D4C24E75126C31136EE2',
  'https://portalsped.fazenda.mg.gov.br/portalnfce/sistema/qrcode.xhtml?p=31240625834847003541651370000437589531865791|2|1|28|75.18|31657a53324f666e306553484c4e49485244434356574a522b31773d|1|EBF057F5847C28DC038F80E2B739B9B7DD69DDBE',
  'https://portalsped.fazenda.mg.gov.br/portalnfce/sistema/qrcode.xhtml?p=31240625834847003541651370000437599061702392|2|1|28|30.50|49396a566a6151743759594a534c675737415853354d6d674571593d|1|8D3D380708B4ED2DE95E6D4710FD80249C1139D3',
  'https://portalsped.fazenda.mg.gov.br/portalnfce/sistema/qrcode.xhtml?p=31240625834847003541651370000437609823315366|2|1|28|39.80|4f67336752504a6e6e49736334587071642f46576f57395a6c48513d|1|5C4D8F793CE9092AD7844B45372E0CD808F3F634',
  'https://portalsped.fazenda.mg.gov.br/portalnfce/sistema/qrcode.xhtml?p=31240625834847003541651400000417459769785083|2|1|03|17.75|6447784779452b2f4b3552356b584d6e75456e74446c735143456f3d|1|DE9A93D5EF3B2BACDDE1A8F8C2F458EC3F15BE4A',
  'https://portalsped.fazenda.mg.gov.br/portalnfce/sistema/qrcode.xhtml?p=31240625834847003541651400000425441222465513|2|1|1|E31DB24D179E17528710BF82A08D2EBB104DB05F',
  'https://portalsped.fazenda.mg.gov.br/portalnfce/sistema/qrcode.xhtml?p=31240625834847003541651400000434191607782566|2|1|1|30727B8B099A40B7F55AB260D35C34085B62C95D',
  'https://portalsped.fazenda.mg.gov.br/portalnfce/sistema/qrcode.xhtml?p=31240703111258000153650100000786921602283319|2|1|1|11CB20FD4E1826D70F4469E4F06BA571EFE15FEB',
  'https://portalsped.fazenda.mg.gov.br/portalnfce/sistema/qrcode.xhtml?p=31240703111258000153650120001235211544691186|2|1|1|C2B4B194AE720D138DAD50519A255E667869B3DC',
  'https://portalsped.fazenda.mg.gov.br/portalnfce/sistema/qrcode.xhtml?p=31240703111258000153650160001078991871349737|2|1|1|DBDF3376CD5A92079A95E0E95152D48758B1CAE3',
  'https://portalsped.fazenda.mg.gov.br/portalnfce/sistema/qrcode.xhtml?p=31240703111258000153650160001086641758911806|2|1|1|5E656008746099AEF8341A50CAB413AF38477A99',
  'https://portalsped.fazenda.mg.gov.br/portalnfce/sistema/qrcode.xhtml?p=31240703111258000153650160001086651463612090|2|1|1|458F07E7746CE1284BCD4BD0C2769E9D7476CDAC',
  'https://portalsped.fazenda.mg.gov.br/portalnfce/sistema/qrcode.xhtml?p=31240703111258000153650170001367231899720382|2|1|1|B8A68BE57A529A35E84184899CB73161270FF53D',
  'https://portalsped.fazenda.mg.gov.br/portalnfce/sistema/qrcode.xhtml?p=31240703111258000153650170001368791980417032|2|1|1|AC4DCD7B4FD19459E5A4775D663392588E9F8C77',
  'https://portalsped.fazenda.mg.gov.br/portalnfce/sistema/qrcode.xhtml?p=31240703111258000153650170001380761632076040|2|1|1|277DE7537BB7974FDAAD210BF08620FE4276F1C1',
  'https://portalsped.fazenda.mg.gov.br/portalnfce/sistema/qrcode.xhtml?p=31240703111258000153650170001380771747878120|2|1|1|E4D5269EF222517C7B3FA694119ED2C6081C3AC3',
  'https://portalsped.fazenda.mg.gov.br/portalnfce/sistema/qrcode.xhtml?p=31240721560153000163650020001622091317760032|2|1|1|74187ECE7C6DD14C302A3D64F73D4402F7940ECB',
  'https://portalsped.fazenda.mg.gov.br/portalnfce/sistema/qrcode.xhtml?p=31240721560153000163650020001637531180949194|2|1|1|4F8118179C12CA3A793C59A0D26F4AF27E64AACE',
  'https://portalsped.fazenda.mg.gov.br/portalnfce/sistema/qrcode.xhtml?p=31240721560153000163650030001610281852364178|2|1|1|A8988E2150AD7C240F0E2882B6584561B18CD917',
  'https://portalsped.fazenda.mg.gov.br/portalnfce/sistema/qrcode.xhtml?p=31240721560153000163650030001610291500047548|2|1|1|9A370EFF4C2206DEEA1E7E54B3A8D70C00D95003',
  'https://portalsped.fazenda.mg.gov.br/portalnfce/sistema/qrcode.xhtml?p=31240721560153000163650030001623871463208967|2|1|1|4DE917200D74D2969EF307B972DA7B15B9787C56',
  'https://portalsped.fazenda.mg.gov.br/portalnfce/sistema/qrcode.xhtml?p=31240721560153000163650030001623881270776421|2|1|1|E6FF95A129A4F93BC30948F4A442E54AD86D0FA8',
  'https://portalsped.fazenda.mg.gov.br/portalnfce/sistema/qrcode.xhtml?p=31240721560153000163650040001539341261708590|2|1|1|D4F687E414062C39A7384C81D39FD6B456BEDECF',
  'https://portalsped.fazenda.mg.gov.br/portalnfce/sistema/qrcode.xhtml?p=31240725834847003541651390000382661050558659|2|1|1|4D5CCED5B41A7C82EEA3365D100B81A83FE14719',
  'https://portalsped.fazenda.mg.gov.br/portalnfce/sistema/qrcode.xhtml?p=31240725834847003541651390000396341159001597|2|1|1|B21D1AC73374092C555E40631FB24EC2B4BD6DB7',
  'https://portalsped.fazenda.mg.gov.br/portalnfce/sistema/qrcode.xhtml?p=31240725834847003541651400000483201331762231|2|1|1|2BE7B55A81B981ABE4697C31ADF1F7A88AED50C3',
  'https://portalsped.fazenda.mg.gov.br/portalnfce/sistema/qrcode.xhtml?p=31240725834847003541651400000483891725387425|2|1|1|038D5CB33BF8BCA7DCEF09FECA35A9FCEBE23FEE',
  'https://portalsped.fazenda.mg.gov.br/portalnfce/sistema/qrcode.xhtml?p=31240725834847003541651400000492971379712646|2|1|1|C4175600F7A973FB4D0C37906910DEBC9038D8C3',
  'https://portalsped.fazenda.mg.gov.br/portalnfce/sistema/qrcode.xhtml?p=31240725834847003541651400000500711891607479|2|1|1|E9E72D33173763BE42AFCCE5A4DD12B7A76CAAB7',
  'https://portalsped.fazenda.mg.gov.br/portalnfce/sistema/qrcode.xhtml?p=31240803111258000153650100000816801467009794|2|1|1|CE0918AF3F597B3E13995BE8F1DA0C4E3970A81D',
  'https://portalsped.fazenda.mg.gov.br/portalnfce/sistema/qrcode.xhtml?p=31240803111258000153650140001209491623294762|2|1|1|CD5B7CE6DDDBC55BC5260E542B7E9B8282ABE979',
  'https://portalsped.fazenda.mg.gov.br/portalnfce/sistema/qrcode.xhtml?p=31240803111258000153650140001210791749307809|2|1|1|69482662357261D4553B18F1A4B57E7E5BA562D1',
  'https://portalsped.fazenda.mg.gov.br/portalnfce/sistema/qrcode.xhtml?p=31240803111258000153650140001234541316639068|2|1|1|9DC88ACA1470C2FF35324759577531FA9214001F',
  'https://portalsped.fazenda.mg.gov.br/portalnfce/sistema/qrcode.xhtml?p=31240803111258000153650160001167241651379854|2|1|1|75A3D2E03BCEC88E625384A6260FCFF1B2C1C3FE',
  'https://portalsped.fazenda.mg.gov.br/portalnfce/sistema/qrcode.xhtml?p=31240803111258000153650170001407011736533020|2|1|1|A8581E86072238F1B05BC2B6C9DBF395DE5386E2',
  'https://portalsped.fazenda.mg.gov.br/portalnfce/sistema/qrcode.xhtml?p=31240803111258000153650170001414921722930130|2|1|1|C44B8DF129991A3E2B3F53A97535555B079E64C6',
  'https://portalsped.fazenda.mg.gov.br/portalnfce/sistema/qrcode.xhtml?p=31240803111258000153650170001434641502171499|2|1|1|FFFE0FD6DBD04D8E0760A53AAF7C0C98697C2563',
  'https://portalsped.fazenda.mg.gov.br/portalnfce/sistema/qrcode.xhtml?p=31240803111258000153650170001458349209230590|2|1|24|45.09|5036566e6d6f7a3132635a6471415a4b7a4869783972466a71666f3d|1|2E5365707A2C21944B1B262618F224B74E756E0B',
  'https://portalsped.fazenda.mg.gov.br/portalnfce/sistema/qrcode.xhtml?p=31240821560153000163650020001651401950670520|2|1|1|6DEAD6B4E66FDFAC6A79399E73F9634D5DEF8630',
  'https://portalsped.fazenda.mg.gov.br/portalnfce/sistema/qrcode.xhtml?p=31240821560153000163650020001694341754529680|2|1|1|F335C77B30B3F15DE61BFB5C143E625A7A21873D',
  'https://portalsped.fazenda.mg.gov.br/portalnfce/sistema/qrcode.xhtml?p=31240821560153000163650020001700811899452751|2|1|1|6E5C823B9CBD73C6C4C2E43F8E99BB52C31C137B',
  'https://portalsped.fazenda.mg.gov.br/portalnfce/sistema/qrcode.xhtml?p=31240821560153000163650050001003431337017466|2|1|1|04FCBE0FB755BBB5355901CDEABDEF430F7A4F8C',
  'https://portalsped.fazenda.mg.gov.br/portalnfce/sistema/qrcode.xhtml?p=31240821560153000163650050001003441117112610|2|1|1|4070A6E35943D3CAEF332E2886FE2BA33A81E9D1',
  'https://portalsped.fazenda.mg.gov.br/portalnfce/sistema/qrcode.xhtml?p=31240821560153000163650060000707221242875474|2|1|1|383D2AB50C874EDCBEC294CBB4B2BD93695057EB',
  'https://portalsped.fazenda.mg.gov.br/portalnfce/sistema/qrcode.xhtml?p=31240825834847003541651400000509761122954404|2|1|1|47C2B33B71047DCD763A81B811817D5D2BD1F968',
  'https://portalsped.fazenda.mg.gov.br/portalnfce/sistema/qrcode.xhtml?p=31240825834847003541651400000512809061610306|2|1|08|29.45|6a6a5349753730656863765031416a706a5367744f3057437541773d|1|71406FB38AD15095B69AAE5850377E5947F33DC6',
  'https://portalsped.fazenda.mg.gov.br/portalnfce/sistema/qrcode.xhtml?p=31240825834847003541651400000518881137374026|2|1|1|3AB46E7E3ECA35263D62A7DD89B86B4A4B1A731D',
  'https://portalsped.fazenda.mg.gov.br/portalnfce/sistema/qrcode.xhtml?p=31240903111258000153650120001321021682467850|2|1|1|F16F52D91B7BFC74678559D7D152D0EB3A4CAD6F',
  'https://portalsped.fazenda.mg.gov.br/portalnfce/sistema/qrcode.xhtml?p=31240903111258000153650120001343881162915550|2|1|1|487ADC54217387FDCE8DA4DFFD00207D0D6E1390',
  'https://portalsped.fazenda.mg.gov.br/portalnfce/sistema/qrcode.xhtml?p=31240903111258000153650120001346701787828336|2|1|1|94DB40891E3BEE572F14F6FDE561AA7E1EE06DB0',
  'https://portalsped.fazenda.mg.gov.br/portalnfce/sistema/qrcode.xhtml?p=31240903111258000153650120001356041744674840|2|1|1|7B9A90F343CA0F878949E6B45730B62FC8F78BA3',
  'https://portalsped.fazenda.mg.gov.br/portalnfce/sistema/qrcode.xhtml?p=31240903111258000153650120001367711601504375|2|1|1|3A136F81B2DB61309FF303987598CE6095B86E75',
  'https://portalsped.fazenda.mg.gov.br/portalnfce/sistema/qrcode.xhtml?p=31240903111258000153650120001383351873056926|2|1|1|E74A11384771875E20D5E5028F421E4708F04B05',
  'https://portalsped.fazenda.mg.gov.br/portalnfce/sistema/qrcode.xhtml?p=31240903111258000153650140001277451306096834|2|1|1|D023CEB8CCB3E24DF399EE336B680B6D69074FC9',
  'https://portalsped.fazenda.mg.gov.br/portalnfce/sistema/qrcode.xhtml?p=31240903111258000153650160001213901011013970|2|1|1|8B37C84B6917890B780396F762E53CD1BEEAECA8',
  'https://portalsped.fazenda.mg.gov.br/portalnfce/sistema/qrcode.xhtml?p=31240903111258000153650160001213911575060495|2|1|1|9F773764D486C3C5F553ABC0845093FFEFD875E9',
  'https://portalsped.fazenda.mg.gov.br/portalnfce/sistema/qrcode.xhtml?p=31240903111258000153650160001220041939677810|2|1|1|F6D2BFF1369A5F61CE399E78E5941F8A183860E7',
  'https://portalsped.fazenda.mg.gov.br/portalnfce/sistema/qrcode.xhtml?p=31240903111258000153650160001226311491107019|2|1|1|47E3A10AA4A5561D9733E0F0D3ADA23DCB3BCF8E',
  'https://portalsped.fazenda.mg.gov.br/portalnfce/sistema/qrcode.xhtml?p=31240903111258000153650160001226321148105095|2|1|1|4552B87DAB96AEECB68BF2C626A146507C2F653E',
  'https://portalsped.fazenda.mg.gov.br/portalnfce/sistema/qrcode.xhtml?p=31240903111258000153650170001502261999117027|2|1|1|B5FDC1366616B3ABC5AEEBF0A00E6196F080E356',
  'https://portalsped.fazenda.mg.gov.br/portalnfce/sistema/qrcode.xhtml?p=31240903111258000153650170001529581043464664|2|1|1|BE3A184B249A24CEBA345432AC0EB6EEC361BBF7',
  'https://portalsped.fazenda.mg.gov.br/portalnfce/sistema/qrcode.xhtml?p=31240921560153000163650030001652781286044980|2|1|1|80A485B08DBED5BF6BB98EFDF5CE92E0A6A53687',
  'https://portalsped.fazenda.mg.gov.br/portalnfce/sistema/qrcode.xhtml?p=31240921560153000163650030001672881112963373|2|1|1|095D7D98A6D1BA45C7957C831EB983ABB0E8D6DE',
  'https://portalsped.fazenda.mg.gov.br/portalnfce/sistema/qrcode.xhtml?p=31240921560153000163650040001631541384773684|2|1|1|400CB1D92965426B21EA47F74F533908CFE124C6',
  'https://portalsped.fazenda.mg.gov.br/portalnfce/sistema/qrcode.xhtml?p=31240921560153000163650040001649391077716960|2|1|1|867E482A365CECCA8BCAF517A9DA8093D319E456',
  'https://portalsped.fazenda.mg.gov.br/portalnfce/sistema/qrcode.xhtml?p=31240921560153000163650050001009501030777304|2|1|1|8FC97B7CE5BA1E835535B8478E2E05967B426C61',
  'https://portalsped.fazenda.mg.gov.br/portalnfce/sistema/qrcode.xhtml?p=31240921560153000163650060000772351671664528|2|1|1|2764CC08F698937B0971AFE738D3A443AAFB1FB2',
  'https://portalsped.fazenda.mg.gov.br/portalnfce/sistema/qrcode.xhtml?p=31240921560153000163650060000793171533087602|2|1|1|53DA8839C5E1C1752EB29FAEE7BD064D61FEFDFF',
  'https://portalsped.fazenda.mg.gov.br/portalnfce/sistema/qrcode.xhtml?p=31240921560153000163650060000804331123652778|2|1|1|744239D1C8EE648F85ACAACA356D69F017C6B539',
  'https://portalsped.fazenda.mg.gov.br/portalnfce/sistema/qrcode.xhtml?p=31240925834847003541651390000468661437349350|2|1|1|9188B4C72914C03B38D9BAAB3CB63797AFBD1C76',
  'https://portalsped.fazenda.mg.gov.br/portalnfce/sistema/qrcode.xhtml?p=31241003111258000153650120001390961163565667|2|1|1|0A138586E26567433ACF9111BFD84D10AE9290B1',
  'https://portalsped.fazenda.mg.gov.br/portalnfce/sistema/qrcode.xhtml?p=31241003111258000153650120001390971778649169|2|1|1|A2B7F850B24A782FCB223835E0FFA3CF267C4894',
  'https://portalsped.fazenda.mg.gov.br/portalnfce/sistema/qrcode.xhtml?p=31241003111258000153650120001417461863724133|2|1|1|DF58AD19E40FD6C43B7632FAAA29B260FC7588E6',
  'https://portalsped.fazenda.mg.gov.br/portalnfce/sistema/qrcode.xhtml?p=31241003111258000153650120001422231338420898|2|1|1|057FD91D53786D6F7353698362B4F87E7C0AAEEB',
  'https://portalsped.fazenda.mg.gov.br/portalnfce/sistema/qrcode.xhtml?p=31241003111258000153650120001450931179265327|2|1|1|3EE7F17C7D03953B42FE1816D216AD0E18A0484C',
  'https://portalsped.fazenda.mg.gov.br/portalnfce/sistema/qrcode.xhtml?p=31241003111258000153650120001451561146557541|2|1|1|F38868C8642D3B7D958D826D5112DAAAA681AA5F',
  'https://portalsped.fazenda.mg.gov.br/portalnfce/sistema/qrcode.xhtml?p=31241003111258000153650140001283301302264775|2|1|1|BFDCD9419732ACB760B7A305873B02019CA269F1',
  'https://portalsped.fazenda.mg.gov.br/portalnfce/sistema/qrcode.xhtml?p=31241003111258000153650140001283311108324862|2|1|1|A3C299D3299050655FE58ED3E12F5791960709A4',
  'https://portalsped.fazenda.mg.gov.br/portalnfce/sistema/qrcode.xhtml?p=31241003111258000153650140001306021233482305|2|1|1|5079135DABD6D4DFA4F009BED259560251CD8922',
  'https://portalsped.fazenda.mg.gov.br/portalnfce/sistema/qrcode.xhtml?p=31241003111258000153650140001311061123548600|2|1|1|AF948713494EF45F50A2BE64F2D651D9E3F0C54A',
  'https://portalsped.fazenda.mg.gov.br/portalnfce/sistema/qrcode.xhtml?p=31241003111258000153650160001275181445118513|2|1|1|5E86CC3700C79E0D76411FA81F8813D084179C68',
  'https://portalsped.fazenda.mg.gov.br/portalnfce/sistema/qrcode.xhtml?p=31241003111258000153650160001285601824806840|2|1|1|E03606940B85AFAAE180E003E68DC5AD3FC2E462',
  'https://portalsped.fazenda.mg.gov.br/portalnfce/sistema/qrcode.xhtml?p=31241003111258000153650170001543681079813505|2|1|1|5C0CB0A7DF6C6DE9543441D5B0544205C3B678B0',
  'https://portalsped.fazenda.mg.gov.br/portalnfce/sistema/qrcode.xhtml?p=31241003111258000153650170001549641355227346|2|1|1|581E4D29C443BC24ED5B012293268ACE30A40FBD',
  'https://portalsped.fazenda.mg.gov.br/portalnfce/sistema/qrcode.xhtml?p=31241003111258000153650170001588991259780984|2|1|1|EAC7F246A63EC854E45CD76F721CE06B157C92A7',
  'https://portalsped.fazenda.mg.gov.br/portalnfce/sistema/qrcode.xhtml?p=31241003111258000153650170001591291732766671|2|1|1|5CE0D238FFB1F8F827ADC3211E72ACD5960458DD',
  'https://portalsped.fazenda.mg.gov.br/portalnfce/sistema/qrcode.xhtml?p=31241003111258000153650170001595031784347500|2|1|1|09872BD589495EDBB6425640AB36FD775447AD7F',
  'https://portalsped.fazenda.mg.gov.br/portalnfce/sistema/qrcode.xhtml?p=31241003111258000153650170001595041059770963|2|1|1|164601B72B124176868874B4CAA8CE09E9352062',
  'https://portalsped.fazenda.mg.gov.br/portalnfce/sistema/qrcode.xhtml?p=31241003111258000153650170001597951468206326|2|1|1|ADBBB142B2F0FAB3F93AA1658DC4B2809867318A',
  'https://portalsped.fazenda.mg.gov.br/portalnfce/sistema/qrcode.xhtml?p=31241003111258000153650170001608211016997591|2|1|1|197C5D79088C2CF146FBE5B908883967411AB65D',
  'https://portalsped.fazenda.mg.gov.br/portalnfce/sistema/qrcode.xhtml?p=31241021560153000163650030001697341757717610|2|1|1|C18E7C6268A0B0BAB61C56E95C5F8990C44518D2',
  'https://portalsped.fazenda.mg.gov.br/portalnfce/sistema/qrcode.xhtml?p=31241021560153000163650030001697351414959959|2|1|1|CF82AD9C9C8B40E9383A7828906A1F80DB9F93D4',
  'https://portalsped.fazenda.mg.gov.br/portalnfce/sistema/qrcode.xhtml?p=31241021560153000163650030001699461900017011|2|1|1|BF44883EFD52607A84299ADFFD7B45FE065DA652',
  'https://portalsped.fazenda.mg.gov.br/portalnfce/sistema/qrcode.xhtml?p=31241021560153000163650040001656011882689327|2|1|1|14D9CA710C57648786DA670FCF4593ABFD5A1251',
  'https://portalsped.fazenda.mg.gov.br/portalnfce/sistema/qrcode.xhtml?p=31241025834847003541651390000496459698341882|2|1|16|46.64|577a4b6a53732b46687057425a4d4258452f444d31756264684e343d|1|D6BA155F21B5BA7FB71D8505234C30DE165A0250',
  'https://portalsped.fazenda.mg.gov.br/portalnfce/sistema/qrcode.xhtml?p=31241025834847003541651390000499451765823767|2|1|1|183415F231F01474AD81F1B742793D415D3F3EF6',
  'https://portalsped.fazenda.mg.gov.br/portalnfce/sistema/qrcode.xhtml?p=31241025834847003541651400000597531458186029|2|1|1|8B71792B94A71C9FE545BAAA3D16CC832BB37F9A',
  'https://portalsped.fazenda.mg.gov.br/portalnfce/sistema/qrcode.xhtml?p=31241103111258000153650120001522961407178632|2|1|1|928C6C2C4337B7E98ECD17191AAAC80E694D0ED6',
  'https://portalsped.fazenda.mg.gov.br/portalnfce/sistema/qrcode.xhtml?p=31241103111258000153650120001522971862426191|2|1|1|F97B25F374B80EF3ABE3F7450E8743293A62E2EB',
  'https://portalsped.fazenda.mg.gov.br/portalnfce/sistema/qrcode.xhtml?p=31241103111258000153650120001540581099633870|2|1|1|C379669B4114477B2012A05950229E82B7BCB8D7',
  'https://portalsped.fazenda.mg.gov.br/portalnfce/sistema/qrcode.xhtml?p=31241103111258000153650160001293271602409600|2|1|1|6FF61D02814DCF0897AE198AB00292C6BBF64C34',
  'https://portalsped.fazenda.mg.gov.br/portalnfce/sistema/qrcode.xhtml?p=31241103111258000153650160001307591749139820|2|1|1|72FB8A9E61DDE9610F239888C334160E39E2EB20',
  'https://portalsped.fazenda.mg.gov.br/portalnfce/sistema/qrcode.xhtml?p=31241103111258000153650160001322161082238922|2|1|1|970780EC1D4585E8AAE0853B77D6A578590B6F68',
  'https://portalsped.fazenda.mg.gov.br/portalnfce/sistema/qrcode.xhtml?p=31241103111258000153650170001654679880543915|2|1|25|14.16|434361777a56686d4f474a54323475727072656e7a5a71763637453d|1|E0FBDA5DF51BB2B94DF38C91F300012BA0347598',
  'https://portalsped.fazenda.mg.gov.br/portalnfce/sistema/qrcode.xhtml?p=31241121560153000163650020001802571696827498|2|1|1|F8B036BF4C1B6A98555B1E50D2BF23661AA70D11',
  'https://portalsped.fazenda.mg.gov.br/portalnfce/sistema/qrcode.xhtml?p=31241121560153000163650020001826119147052206|2|1|20|68.92|676F3352316877742F396956795979576B54566B306859796A6E6B3D|1|8D1D03193347D5600BA2F84DD7FAF83DC71723C2',
  'https://portalsped.fazenda.mg.gov.br/portalnfce/sistema/qrcode.xhtml?p=31241121560153000163650020001829031722765667|2|1|1|B5DE128F3ABBC667D23B3FE66C54AF1627C375B7',
  'https://portalsped.fazenda.mg.gov.br/portalnfce/sistema/qrcode.xhtml?p=31241121560153000163650030001715411181599332|2|1|1|CF2D8D0AC51A4779BD57F745D1D94A14BDA754BE',
  'https://portalsped.fazenda.mg.gov.br/portalnfce/sistema/qrcode.xhtml?p=31241121560153000163650030001722871078652983|2|1|1|C2E1B7CF9400345D760C961D97E04EE8B58A4562',
  'https://portalsped.fazenda.mg.gov.br/portalnfce/sistema/qrcode.xhtml?p=31241121560153000163650030001724441038625881|2|1|1|F2F764B54690E3878915F15E065323FF5CEFE450',
  'https://portalsped.fazenda.mg.gov.br/portalnfce/sistema/qrcode.xhtml?p=31241121560153000163650040001747231815960133|2|1|1|CE7477165C0EF85E29138C8B7A9763DACB2CA5AF',
  'https://portalsped.fazenda.mg.gov.br/portalnfce/sistema/qrcode.xhtml?p=31241125834847003541651390000521481599098984|2|1|1|CDF456913D439BFF9869928EF601DB1926ACD32F',
  'https://portalsped.fazenda.mg.gov.br/portalnfce/sistema/qrcode.xhtml?p=31241203111258000153650160001356091778665789|2|1|1|0C18FB93B126C1ABB22DEE20AFA72B9ADD0EE93A',
  'https://portalsped.fazenda.mg.gov.br/portalnfce/sistema/qrcode.xhtml?p=31241203111258000153650170001685011216899997|2|1|1|E6A869D5AF85EE56A4754D08602F1F7E211C9D68',
  'https://portalsped.fazenda.mg.gov.br/portalnfce/sistema/qrcode.xhtml?p=31241203111258000153650170001691741637023604|2|1|1|F99D73B2BF4403FCF23560AA7BC25E80FD3E514C',
  'https://portalsped.fazenda.mg.gov.br/portalnfce/sistema/qrcode.xhtml?p=31241203111258000153650170001695621632964495|2|1|1|C0FE4BB9104C636E8B6F28896101712DEB34AF57',
  'https://portalsped.fazenda.mg.gov.br/portalnfce/sistema/qrcode.xhtml?p=31241203111258000153650170001695631267847320|2|1|1|C5A778D1C5AACA2550AF817460FA78F4558C0108',
  'https://portalsped.fazenda.mg.gov.br/portalnfce/sistema/qrcode.xhtml?p=31241221560153000163650030001757681198084310|2|1|1|C17BF63814409E10FC3C12FB085994820A657A7C',
  'https://portalsped.fazenda.mg.gov.br/portalnfce/sistema/qrcode.xhtml?p=31241221560153000163650030001757871204442606|2|1|1|0C9F9A21E46A9F305CC7114655D2BDD4ABE6DE15',
  'https://portalsped.fazenda.mg.gov.br/portalnfce/sistema/qrcode.xhtml?p=31241221560153000163650030001761911030778340|2|1|1|6311FCE1CD4ED3D8A594A9D8C084067C6CD0CD0F',
  'https://portalsped.fazenda.mg.gov.br/portalnfce/sistema/qrcode.xhtml?p=31241221560153000163650030001765361599964702|2|1|1|BCDB1D3DCC428B6EAC4C858C347F4434EFA2E4FD',
  'https://portalsped.fazenda.mg.gov.br/portalnfce/sistema/qrcode.xhtml?p=31241225834847003541651400000652621841117608|2|1|1|C455E2C75AF11612460CB1653904AF29CBDCE2DF',
  'https://portalsped.fazenda.mg.gov.br/portalnfce/sistema/qrcode.xhtml?p=31250103111258000153650100000941151679504592|2|1|1|14AE2C1C7CD4E9B035B864678A4BE101BBA72BCC',
  'https://portalsped.fazenda.mg.gov.br/portalnfce/sistema/qrcode.xhtml?p=31250103111258000153650120001628231445147713|2|1|1|E9790C09BFC19CD1BDAE0FD40E970053BC79B892',
  'https://portalsped.fazenda.mg.gov.br/portalnfce/sistema/qrcode.xhtml?p=31250103111258000153650120001642721819858169|2|1|1|2F86FA4156FF48021EF3DBE21D4B7562C9EA612A',
  'https://portalsped.fazenda.mg.gov.br/portalnfce/sistema/qrcode.xhtml?p=31250103111258000153650120001668731699532201|2|1|1|8AB6E5FE87E449C2F23E38843135B77A017A90D2',
  'https://portalsped.fazenda.mg.gov.br/portalnfce/sistema/qrcode.xhtml?p=31250103111258000153650140001417351645297910|2|1|1|B47E3722120BD5178E488C2BD2E8D8B15CDDC55D',
  'https://portalsped.fazenda.mg.gov.br/portalnfce/sistema/qrcode.xhtml?p=31250103111258000153650170001753831751720930|2|1|1|16552D50FAB1D0E76A1C8DA2B12605B24DBC59B5',
  'https://portalsped.fazenda.mg.gov.br/portalnfce/sistema/qrcode.xhtml?p=31250103111258000153650170001766381184663654|2|1|1|D51E40455BE723EED5A8A20DB1711A5CE6DB04AF',
  'https://portalsped.fazenda.mg.gov.br/portalnfce/sistema/qrcode.xhtml?p=31250121560153000163650020001904481369210654|2|1|1|83CA3DEF627FE7D6F0B0D3847A4291C4C116A4D3',
  'https://portalsped.fazenda.mg.gov.br/portalnfce/sistema/qrcode.xhtml?p=31250121560153000163650020001904491552545578|2|1|1|D56C4AD6B86828609277EE5B456F5BFC613DC36C',
];
