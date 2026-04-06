import type { GameStatement, PlayerSymbol } from '@/types/game'
import type { DerivedGhost } from '@/types/derived-game'
import { initGameState } from '../shared'

/**
 * ~500 common English words (4-8 letters) for Ghost gameplay.
 */
const WORDS: string[] = [
  'able','about','above','accept','across','action','active','actual','added','after',
  'again','against','aged','agent','agree','ahead','allow','almost','alone','along',
  'already','also','always','among','amount','anger','angle','angry','animal','answer',
  'apart','apple','apply','area','argue','army','around','arrive','aside','asked',
  'assume','attack','attend','avoid','award','aware','back','badly','balance','band',
  'bank','base','basic','basis','batch','bath','bear','beat','become','been',
  'before','began','begin','behind','being','believe','belong','below','bend','best',
  'better','between','beyond','birth','black','blade','blame','blank','blast','blaze',
  'blend','bless','blind','block','blood','blown','blue','board','boat','body',
  'bond','bone','book','border','born','both','bottom','bound','brain','branch',
  'brand','brave','bread','break','breed','brick','bridge','brief','bright','bring',
  'broad','broke','brother','brown','brush','build','bunch','burden','burn','burst',
  'busy','buyer','cabin','cable','call','calm','came','camera','camp','cancel',
  'capable','capture','card','care','career','carry','case','cash','cast','catch',
  'cause','cell','center','central','certain','chain','chair','chamber','chance','change',
  'chapter','charge','chart','chase','cheap','check','chest','chief','child','choice',
  'choose','chunk','circle','citizen','city','civil','claim','class','clean','clear',
  'climb','clock','close','clothes','cloud','club','coach','code','cold','collect',
  'college','color','column','combine','come','comfort','command','comment','commit','common',
  'company','compare','complete','concern','confirm','connect','consider','contact','contain','content',
  'context','continue','control','convert','cook','cool','copy','core','corner','correct',
  'cost','could','count','country','county','couple','courage','course','court','cover',
  'crack','craft','crash','crazy','cream','create','credit','crew','crime','critic',
  'cross','crowd','crush','cultural','culture','current','customer','cycle','daily','damage',
  'dance','danger','dare','dark','data','date','daughter','dead','deal','dear',
  'death','debate','debt','decade','decide','deck','declare','decline','deep','defeat',
  'defend','define','degree','delay','deliver','demand','deny','depart','depend','deploy',
  'depth','deputy','derive','describe','desert','design','desire','desk','destroy','detail',
  'detect','develop','device','devote','dialog','diamond','diet','differ','digital','dinner',
  'direct','dirty','discover','discuss','disease','display','distance','distinct','divide','doctor',
  'document','dollar','domain','domestic','door','double','doubt','down','draft','drag',
  'drama','draw','dream','dress','drink','drive','drop','drug','during','dust',
  'duty','each','eager','early','earn','earth','ease','east','easy','edge',
  'edition','editor','effect','effort','eight','either','elder','elect','element','else',
  'emerge','emotion','employ','empty','enable','encounter','encourage','enemy','energy','engage',
  'engine','enjoy','enough','ensure','enter','entire','entry','equal','error','escape',
  'essay','establish','even','evening','event','ever','every','evidence','evil','evolve',
  'exact','examine','example','except','exchange','excite','execute','exercise','exhibit','exist',
  'expand','expect','expense','expert','explain','explore','export','expose','extend','extent',
  'extra','extreme','face','fact','factor','fail','fair','faith','fall','false',
  'family','famous','fancy','farm','fast','fate','father','fault','favor','fear',
  'feature','federal','feel','female','fence','fewer','field','fifth','fifty','fight',
  'figure','file','fill','film','final','finally','finance','find','fine','finger',
  'finish','fire','firm','first','fish','fixed','flag','flame','flash','flat',
  'flesh','flight','float','floor','flow','flower','focus','fold','folk','follow',
  'food','foot','force','foreign','forest','forget','form','formal','former','formula',
  'forth','fortune','forward','found','foundation','four','frame','free','freedom','fresh',
  'friend','front','fruit','fuel','full','fund','funny','future','gain','game',
  'garden','gate','gather','gave','general','generation','gentle','ghost','gift','girl',
  'give','glad','glass','global','goal','gold','golden','gone','good','govern',
  'grab','grace','grade','grain','grand','grant','grass','grave','gray','great',
  'green','grew','ground','group','grow','growth','guard','guess','guide','guilty',
  'hair','half','hall','hand','handle','hang','happen','happy','hard','harm',
  'hate','have','head','health','hear','heart','heat','heavy','height','help',
  'here','hero','hide','high','hill','himself','hire','history','hold','hole',
  'home','honest','honor','hope','horse','host','hotel','hour','house','household',
  'huge','human','humor','hundred','hunt','hurt','idea','identify','ignore','image',
  'imagine','impact','imply','import','impose','improve','include','income','increase','indeed',
  'indicate','industry','inform','initial','inner','input','insert','inside','insist','install',
  'instance','instead','intend','interest','internal','into','introduce','invest','involve','iron',
  'island','issue','item','itself','join','joint','joke','journal','journey','judge',
  'jump','junior','jury','just','justice','keen','keep','kept','kick','kill',
  'kind','king','kiss','knee','knew','knife','knock','know','label','lack',
  'lake','land','language','large','last','late','later','laugh','launch','lawn',
  'lawyer','layer','lead','leader','leaf','league','lean','learn','least','leave',
  'left','legal','lend','length','less','lesson','letter','level','liberal','library',
  'life','lift','light','like','likely','limit','line','link','list','listen',
  'little','live','load','loan','local','lock','long','look','lord','lose',
  'loss','lost','love','lovely','lower','luck','lunch','machine','magic','mail',
  'main','maintain','major','make','male','manage','manner','many','mark','market',
  'marriage','married','mask','mass','master','match','material','matter','maybe','meal',
  'mean','measure','media','medical','meet','member','memory','mental','mention','mere',
  'message','method','middle','might','military','mind','mine','minister','minor','minute',
  'mirror','miss','mission','mistake','mode','model','modern','moment','money','month',
  'mood','moon','moral','more','morning','most','mother','motion','mount','mouth',
  'move','much','murder','music','must','mutual','myself','name','narrow','nation',
  'national','natural','nature','near','nearly','necessary','neck','need','negative','neither',
  'nerve','network','never','news','next','nice','night','nine','nobody','nod',
  'noise','none','normal','north','note','nothing','notice','notion','novel','number',
  'nurse','object','observe','obtain','obvious','occur','ocean','offer','office','officer',
  'official','often','once','only','onto','open','operate','opinion','option','orange',
  'order','ordinary','other','otherwise','ought','ourselves','outcome','output','outside','over',
  'overall','overcome','owner','pace','pack','page','paid','pain','paint','pair',
  'pale','palm','panel','paper','parent','park','part','partly','partner','party',
  'pass','passage','past','path','patient','pattern','pause','peace','peak','peer',
  'penalty','people','percent','perfect','perform','perhaps','period','permit','person','phase',
  'phone','photo','phrase','physical','pick','picture','piece','pilot','pine','pitch',
  'place','plain','plan','plane','plant','plate','play','player','please','pledge',
  'plot','plus','pocket','poem','poet','point','police','policy','politics','pool',
  'poor','popular','portion','position','positive','possible','post','potato','potential','pound',
  'pour','poverty','power','practice','prayer','prefer','prepare','presence','present','preserve',
  'president','press','pressure','prevent','previous','price','pride','primary','prince','principle',
  'print','prior','prison','private','prize','probably','problem','proceed','process','produce',
  'product','profit','program','progress','project','promise','promote','proof','proper','property',
  'proportion','proposal','propose','prospect','protect','protein','protest','prove','provide','public',
  'pull','punch','purchase','pure','purpose','push','qualify','quarter','question','quick',
  'quiet','quite','quote','race','radical','rain','raise','range','rank','rapid',
  'rare','rate','rather','reach','react','read','ready','real','reality','realize',
  'really','reason','recall','receive','recent','recognize','record','recover','reduce','refer',
  'reflect','reform','regard','region','regular','reject','relate','release','relief','religion',
  'rely','remain','remark','remember','remind','remote','remove','repeat','replace','report',
  'represent','request','require','research','resource','respond','response','rest','restore','result',
  'retain','retire','return','reveal','review','revolution','rich','ride','right','ring',
  'rise','risk','river','road','rock','role','roll','romantic','roof','room',
  'root','rope','rough','round','route','rule','rush','safe','safety','sake',
  'salt','same','sand','satisfy','save','scale','scene','schedule','scheme','school',
  'science','scope','score','screen','search','season','seat','second','secret','section',
  'secure','seek','seem','seize','select','sell','senator','send','senior','sense',
  'sentence','separate','sequence','series','serious','serve','service','session','settle','seven',
  'several','severe','shade','shadow','shake','shall','shape','share','sharp','shift',
  'shine','ship','shirt','shock','shoot','shop','shore','short','shot','should',
  'shoulder','shout','show','shut','sick','side','sight','sign','signal','silence',
  'silver','similar','simple','since','sing','single','sister','site','situation','size',
  'skill','skin','sleep','slice','slide','slight','slip','slow','small','smart',
  'smell','smile','smoke','smooth','snap','snow','soft','soil','soldier','solid',
  'solution','solve','some','somebody','somehow','someone','something','sometimes','somewhat','song',
  'soon','sorry','sort','soul','sound','source','south','space','speak','special',
  'specific','speech','speed','spend','spirit','split','sport','spot','spread','spring',
  'square','stable','staff','stage','stake','stand','standard','star','start','state',
  'statement','station','status','stay','steady','steal','steel','steep','step','stick',
  'still','stock','stomach','stone','stood','stop','store','storm','story','strange',
  'strategy','stream','street','strength','stress','stretch','strike','string','strip','stroke',
  'strong','struggle','student','study','stuff','style','subject','submit','succeed','success',
  'such','sudden','suffer','sugar','suggest','suit','summer','supply','support','suppose',
  'sure','surface','surprise','survive','suspect','sweet','swim','swing','switch','symbol',
  'system','table','tail','take','tale','talk','tall','tank','tape','target',
  'task','taste','teach','team','technical','technique','technology','telephone','television','tell',
  'tend','term','test','text','than','thank','that','their','them','theme',
  'then','theory','there','these','thick','thin','thing','think','third','those',
  'though','thought','thousand','threat','three','throat','through','throw','thus','ticket',
  'tight','time','tiny','title','today','together','tone','tonight','tool','tooth',
  'topic','total','touch','tough','tour','toward','tower','town','trace','track',
  'trade','tradition','traffic','trail','train','transfer','transform','travel','treat','treatment',
  'tree','trend','trial','tribe','trick','trip','troop','trouble','truck','true',
  'truly','trust','truth','turn','twice','type','typical','ugly','ultimate','uncle',
  'under','understand','union','unique','unit','united','universe','unknown','unless','unlike',
  'until','upon','upper','urban','used','useful','user','usual','valley','value',
  'variety','various','vast','version','very','victim','video','view','village','violence',
  'virtue','visible','vision','visit','vital','voice','volume','vote','wage','wait',
  'wake','walk','wall','want','warm','warn','wash','waste','watch','water',
  'wave','weak','wealth','weapon','wear','weather','week','weigh','weight','welcome',
  'well','west','western','what','wheel','when','where','whether','which','while',
  'white','whole','whom','whose','wide','wife','wild','will','wind','window',
  'wine','wing','winter','wire','wise','wish','with','within','without','woman',
  'wonder','wood','word','work','worker','world','worry','worst','worth','would',
  'wrap','write','writer','wrong','yard','yeah','year','yellow','young','yours',
  'youth','zone',
]

/** Set of all words in the word list */
export const wordSet = new Set(WORDS)

/** Set of all prefixes of words in the word list */
export const prefixSet: Set<string> = (() => {
  const s = new Set<string>()
  for (const w of WORDS) {
    for (let i = 1; i <= w.length; i++) {
      s.add(w.slice(0, i))
    }
  }
  return s
})()


export function deriveGhost(gameId: string, stmts: GameStatement[]): DerivedGhost | null {
  const init = initGameState(gameId, stmts)
  if (!init) return null

  const { relevant, create } = init
  let { status, result, moveCount, updatedAt } = init

  let fragment = ''
  const ghostLetters = { X: 0, O: 0 }
  let completedWord = false
  let challengeResult: DerivedGhost['challengeResult'] = null
  // Track current turn explicitly (alternates within a round; resets on new round)
  let roundTurn: PlayerSymbol = 'X'

  for (const stmt of relevant) {
    if (stmt.type !== 'make_move') continue
    if (status !== 'playing') continue

    const isX = stmt.player === create.playerX
    const symbol: PlayerSymbol = isX ? 'X' : 'O'

    // Reject out-of-turn moves
    if (symbol !== roundTurn) continue

    // Reset state from previous round resolution
    completedWord = false
    challengeResult = null

    if (stmt.ghostChallenge) {
      // Challenge: current player claims the fragment can't lead to a word
      const isPrefix = prefixSet.has(fragment)

      if (isPrefix) {
        // Fragment IS a valid prefix => challenger is penalized
        ghostLetters[symbol]++
        challengeResult = 'challenger_loses'
      } else {
        // Fragment is NOT a valid prefix => previous player penalized
        const prevPlayer: PlayerSymbol = symbol === 'X' ? 'O' : 'X'
        ghostLetters[prevPlayer]++
        challengeResult = 'challenger_wins'
      }

      moveCount++
      updatedAt = stmt.timestamp
      fragment = ''
      roundTurn = 'X' // Reset to X for new round

      // Check if anyone is eliminated
      if (ghostLetters.X >= 5) {
        result = 'o_wins'
        status = 'finished'
      } else if (ghostLetters.O >= 5) {
        result = 'x_wins'
        status = 'finished'
      }
    } else if (stmt.ghostLetter) {
      const letter = stmt.ghostLetter.toLowerCase()
      if (letter.length !== 1 || letter < 'a' || letter > 'z') continue

      fragment += letter
      moveCount++
      updatedAt = stmt.timestamp

      // Check if fragment forms a complete word (4+ letters)
      if (fragment.length >= 4 && wordSet.has(fragment)) {
        completedWord = true
        ghostLetters[symbol]++
        fragment = ''
        roundTurn = 'X' // Reset to X for new round

        // Check elimination
        if (ghostLetters.X >= 5) {
          result = 'o_wins'
          status = 'finished'
        } else if (ghostLetters.O >= 5) {
          result = 'x_wins'
          status = 'finished'
        }
      } else {
        // Alternate turn within the round
        roundTurn = roundTurn === 'X' ? 'O' : 'X'
      }
    }
  }

  return {
    id: gameId,
    gameType: 'ghost',
    fragment,
    ghostLetters,
    completedWord,
    challengeResult,
    playerX: create.playerX,
    playerXName: create.playerXName ?? null,
    playerO: init.playerO,
    playerOName: init.playerOName,
    currentTurn: roundTurn,
    status,
    result,
    moveCount,
    vsComputer: create.vsComputer ?? false,
    createdAt: create.timestamp,
    updatedAt,
  }
}
