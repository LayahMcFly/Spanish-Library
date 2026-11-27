registerBook({
  id: 'rosas',
  title: 'La familia del reino de las rosas',
  titleEn: 'The Family of the Kingdom of Roses',
  level: 'A1–A2',
  genre: 'Medieval royal fantasy · Family',
  desc: 'A kind king and queen long for children. One day in the village, the queen meets two orphaned twins, and a castle full of roses, secrets and laughter gets a new family.',
  cover: 'castle',
  chapters: [
/* ───────────── CHAPTER 1 ───────────── */
{
title: 'Una mañana en el reino', titleEn: 'A morning in the kingdom',
summary: 'We meet the king, the queen and their quiet castle.',
text: `
Era una mañana muy soleada. ## It was a very sunny morning. ## "Era" is the past of "ser" (to be). We use it to describe how things were. "Muy" means "very".
El reino de las rosas era grande y bonito. ## The Kingdom of Roses was big and pretty.
Había rosas rojas, rosas blancas y rosas rosadas en todas partes. ## There were red roses, white roses and pink roses everywhere. ## "Había" means "there was" or "there were". "En todas partes" is a set expression: everywhere.
En el centro del reino había un castillo de piedra gris. ## In the center of the kingdom there was a castle made of gray stone. ## "De piedra" = made of stone. In Spanish, the adjective usually comes after the noun: "piedra gris" (gray stone).

En el castillo vivían el rey Alejandro y la reina Isabella. ## King Alejandro and Queen Isabella lived in the castle. ## "Vivían" is a past form of "vivir" (to live). It describes something that went on for a long time.
El rey era amable, inteligente y muy cariñoso. ## The king was kind, intelligent and very affectionate.
La reina era dulce, generosa y siempre sonreía. ## The queen was sweet, generous and always smiled. ## "Sonreía" is a past form of "sonreír". It describes something she did again and again.
Todos en el reino los querían mucho. ## Everyone in the kingdom loved them very much. ## "Los" here means "them". The verb "querer" can mean "to want" or "to love" depending on the context.

Esa mañana, Isabella se despertó temprano. ## That morning, Isabella woke up early. ## "Despertarse" is a reflexive verb: "se despertó" literally means "she woke herself up".
Abrió la ventana y miró el jardín. ## She opened the window and looked at the garden.
Un pájaro cantaba en un árbol. ## A bird was singing in a tree.
El sol brillaba sobre las flores. ## The sun was shining on the flowers.
La reina sonrió, pero sus ojos estaban un poco tristes. ## The queen smiled, but her eyes were a little sad. ## "Estaban" comes from "estar". We use "estar" for feelings and conditions that can change.

Alejandro entró en la habitación con una taza de té. ## Alejandro came into the room with a cup of tea.
«Buenos días, mi amor», dijo el rey. ## "Good morning, my love," said the king. ## "Mi amor" (my love) is a very common way to speak to a partner.
«Buenos días, Alejandro», respondió la reina. ## "Good morning, Alejandro," answered the queen.
«¿Por qué estás triste?», preguntó él. ## "Why are you sad?" he asked. ## "Por qué" (two words, with an accent) is used in questions. "Porque" (one word) means "because".
Isabella miró el castillo grande y silencioso. ## Isabella looked at the big, quiet castle.
«Tenemos todo», dijo ella, «pero la casa está muy tranquila». ## "We have everything," she said, "but the house is very quiet." ## Spanish quotes look like « ». The words "dijo ella" can go in the middle of what someone says.
«Quiero escuchar niños en los pasillos», dijo con una sonrisa suave. ## "I want to hear children in the hallways," she said with a soft smile. ## "Escuchar" means to listen or to hear. "Con una sonrisa" = with a smile.

El rey tomó la mano de la reina. ## The king took the queen's hand. ## Spanish says "la mano de la reina" (the hand of the queen). There is no 's like in English.
«Yo también quiero una familia grande», dijo. ## "I also want a big family," he said.
«Un día, tendremos niños en nuestro castillo». ## "One day, we will have children in our castle." ## "Tendremos" is the future of "tener": we will have.
La reina abrazó a su esposo. ## The queen hugged her husband.
Los dos miraron las rosas por la ventana y esperaron con esperanza. ## The two of them looked at the roses through the window and waited with hope. ## "Esperar" can mean "to wait" or "to hope". "Esperanza" is the noun: hope.
`,
quiz: [
  Q.comp('How did Isabella feel on the sunny morning?', ['A little sad, because the castle was too quiet','Angry at the king','Afraid of dragons','Very sleepy'], 'La reina sonrió, pero sus ojos estaban un poco tristes.', 'She smiled, but her eyes were a little sad. The castle had everything, but it felt too quiet without children.'),
  Q.comp('What does the queen want to hear in the castle?', ['Children in the hallways','Music in the garden','Birds in the trees','The king singing'], '«Quiero escuchar niños en los pasillos», dijo con una sonrisa suave.', 'She says she wants to hear children in the hallways.'),
  Q.comp('What does the king bring to Isabella in the morning?', ['A cup of tea','A red rose','A letter','A loaf of bread'], 'Alejandro entró en la habitación con una taza de té.', '"Una taza de té" means "a cup of tea".'),
  Q.vocab('In the sentence "El rey era amable, inteligente y muy cariñoso", what does "amable" mean?', ['kind','tall','old','funny'], 'El rey era amable, inteligente y muy cariñoso.', '"Amable" means kind or friendly. It looks a bit like "amiable" in English.'),
  Q.match([['ventana','window'],['jardín','garden'],['reina','queen'],['castillo','castle']]),
  Q.sent('Choose the correct English translation of: "Había rosas rojas, rosas blancas y rosas rosadas en todas partes."', ['There were red roses, white roses and pink roses everywhere.','There was one red rose and one white rose in the garden.','The roses were red, white and pink in the castle.','Red roses grew in the village and white roses at home.'], 'Había rosas rojas, rosas blancas y rosas rosadas en todas partes.', '"Había" = there were, and "en todas partes" = everywhere.'),
  Q.fill('Isabella ___ la ventana. (she opened)', ['abrió'], 'Abrió la ventana y miró el jardín.', '"Abrió" is the past form of "abrir" for he / she / it.', 'Starts with "a"'),
  Q.tr('The castle was big.', ['El castillo era grande','El castillo era muy grande','El castillo era enorme'], 'El reino de las rosas era grande y bonito.', 'Use "era" (was) to describe: "El castillo era grande".'),
  Q.short('Who lived in the castle? Write one short sentence (Spanish or English).', 'El rey Alejandro y la reina Isabella vivían en el castillo.')
]
},
/* ───────────── CHAPTER 2 ───────────── */
{
title: 'El pueblo y el orfanato', titleEn: 'The village and the orphanage',
summary: 'Isabella visits the village and hears a child laughing.',
text: `
Después del desayuno, Isabella decidió visitar el pueblo. ## After breakfast, Isabella decided to visit the village. ## "Después de" + noun means "after". "Decidió" is the past of "decidir".
Se puso un vestido azul y un sombrero con una rosa. ## She put on a blue dress and a hat with a rose. ## "Ponerse" means "to put on" clothes. "Se puso" = she put on.
Dos guardias caminaron detrás de ella. ## Two guards walked behind her.
En la calle, las personas saludaban a la reina. ## In the street, the people greeted the queen. ## "Saludaban" is a past form: they were greeting (again and again).
«¡Buenos días, majestad!», decía una señora. ## "Good morning, Your Majesty!" said a lady. ## "Majestad" is how you speak to a king or queen.
Isabella sonreía y saludaba a todos con la mano. ## Isabella smiled and waved at everyone with her hand.

El pueblo tenía un mercado grande con frutas, pan y flores. ## The village had a big market with fruit, bread and flowers.
La reina compró manzanas rojas para los guardias. ## The queen bought red apples for the guards. ## "Para" often means "for".
También compró un pan dulce para ella. ## She also bought a sweet bread for herself. ## "Para ella" = for her (here, for herself).
De repente, escuchó una risa alegre al final de la calle. ## Suddenly, she heard a happy laugh at the end of the street. ## "De repente" is a set expression: suddenly. "Al final de" = at the end of.
Era una risa de niño. ## It was a child's laugh.
El corazón de Isabella latió muy rápido. ## Isabella's heart beat very fast.

Al final de la calle había una casa vieja con una puerta azul. ## At the end of the street there was an old house with a blue door.
Era el orfanato del pueblo. ## It was the village orphanage. ## An "orfanato" is a home for children who do not have parents. "Del" = "de + el" (of the).
Una señora mayor abrió la puerta y sonrió. ## An older lady opened the door and smiled. ## "Mayor" can mean "older" (about age) or "bigger".
Se llamaba Margarita y cuidaba a los niños. ## Her name was Margarita and she took care of the children. ## "Se llamaba" literally means "she called herself". "Cuidar" = to take care of.
«Pase, por favor, pase», dijo Margarita. ## "Please come in, come in," said Margarita.
Dentro de la casa había diez niños. ## Inside the house there were ten children.
Algunos jugaban con pelotas y otros dibujaban en la mesa. ## Some were playing with balls and others were drawing at the table. ## "Algunos... otros..." = some... others...

En un rincón, la reina vio a dos niños pequeños. ## In a corner, the queen saw two small children. ## "Niños" can mean "boys" or "children" (boys and girls together).
Eran una niña y un niño, y tenían la misma cara. ## They were a girl and a boy, and they had the same face. ## "Eran" is the past of "son": they were.
La niña tenía el pelo largo y castaño. ## The girl had long brown hair. ## Spanish uses "el pelo" (the hair) instead of "her hair".
El niño tenía el pelo corto y los ojos muy grandes. ## The boy had short hair and very big eyes.
La niña leía un libro viejo con mucha atención. ## The girl was reading an old book with a lot of attention.
El niño hacía un barco con papel. ## The boy was making a boat out of paper.
«Son gemelos», explicó Margarita. ## "They are twins," explained Margarita. ## "Gemelos" = twins. For two girls you would say "gemelas".
«Se llaman Emilia y Lucas». ## "Their names are Emilia and Lucas." ## "Se llaman" literally means "they call themselves". It is how Spanish says "their names are".
«No tienen padres, pero se tienen el uno al otro». ## "They have no parents, but they have each other." ## "El uno al otro" = each other. "Padres" can mean "parents" or "fathers".
`,
quiz: [
  Q.comp('Why did Isabella go into the village?', ['She decided to visit the village','She was looking for a new dress','She wanted to meet the guards','She needed to find the king'], 'Después del desayuno, Isabella decidió visitar el pueblo.', '"Decidió visitar el pueblo" = she decided to visit the village.'),
  Q.comp('What did Isabella hear at the end of the street?', ['A happy child\'s laugh','A bell','A crying baby','The guards singing'], 'De repente, escuchó una risa alegre al final de la calle.', 'She heard "una risa alegre", a happy laugh.'),
  Q.comp('What was the old house with the blue door?', ['The village orphanage','A bakery','The market','A school'], 'Era el orfanato del pueblo.', '"Orfanato" = orphanage.'),
  Q.vocab('What does "de repente" mean in the story?', ['suddenly','slowly','tomorrow','again'], 'De repente, escuchó una risa alegre al final de la calle.', '"De repente" is a fixed expression that means "suddenly".'),
  Q.match([['calle','street'],['puerta','door'],['libro','book'],['barco','boat']]),
  Q.sent('Choose the correct English translation of: "Eran una niña y un niño, y tenían la misma cara."', ['They were a girl and a boy, and they had the same face.','There was a girl and a boy, and they had a mask.','The girl and the boy were friends with the same face.','They were two boys and a girl.'], 'Eran una niña y un niño, y tenían la misma cara.', '"La misma cara" = the same face. This is how we know they are twins.'),
  Q.fill('La niña ___ un libro viejo. (was reading)', ['leía'], 'La niña leía un libro viejo con mucha atención.', '"Leía" is the past form of "leer" that describes an action in progress.', 'Starts with "l"'),
  Q.tr('The old house.', ['La casa vieja'], 'Al final de la calle había una casa vieja con una puerta azul.', '"Casa" is feminine, so we say "la casa vieja". The adjective comes after the noun.'),
  Q.short('What did the two children look like? Write one short sentence (Spanish or English).', 'Los niños tenían la misma cara y los ojos grandes.')
]
},
/* ───────────── CHAPTER 3 ───────────── */
{
title: 'Emilia y Lucas', titleEn: 'Emilia and Lucas',
summary: 'Isabella meets the twins and spends the afternoon playing.',
text: `
Isabella se sentó en el suelo, cerca de los gemelos. ## Isabella sat down on the floor, near the twins. ## "Sentarse" = to sit down. "Cerca de" = near.
«Hola», dijo con una voz muy suave. ## "Hello," she said in a very soft voice.
«¿Cómo te llamas?», preguntó a la niña. ## "What is your name?" she asked the girl. ## "¿Cómo te llamas?" literally means "How do you call yourself?" It is the usual way to ask someone's name.
La niña miró a la reina con ojos curiosos. ## The girl looked at the queen with curious eyes.
«Me llamo Emilia», respondió. ## "My name is Emilia," she answered. ## "Me llamo" literally means "I call myself".
«¿Eres una reina de verdad?», preguntó. ## "Are you a real queen?" she asked. ## "De verdad" means "real" or "for real".
La reina se rió. ## The queen laughed. ## "Reírse" = to laugh. "Se rió" is the past form.
«Sí, soy una reina de verdad», dijo. ## "Yes, I am a real queen," she said.
«¿Y tú, qué lees en ese libro?», preguntó Isabella. ## "And you, what are you reading in that book?" asked Isabella. ## "Lees" = you read. Spanish often leaves out the word for "you" because the verb already shows it.

«Es un libro sobre dragones», dijo Emilia. ## "It is a book about dragons," said Emilia. ## "Sobre" can mean "on" or "about".
«Los dragones no son malos», dijo Emilia. ## "Dragons are not bad," said Emilia. ## "Malo" means "bad". Before a masculine noun it becomes "mal", but here it stands alone: "malos".
«Solo tienen mucho miedo de las personas». ## "They are just very afraid of people." ## "Tener miedo de" = to be afraid of. Literally "to have fear of".
Isabella pensó que era la idea más bonita del mundo. ## Isabella thought it was the prettiest idea in the world. ## "La idea más bonita" = the prettiest idea. Put "más" before an adjective to say "-est" ("most").
En ese momento, el niño llegó corriendo con su barco de papel. ## At that moment, the boy arrived running with his paper boat. ## "Llegó corriendo" = arrived running. The "-ando / -iendo" ending is like "-ing" in English.
«¡Mira, mira!», gritó. ## "Look, look!" he shouted. ## "Mira" is the command form of "mirar".
«¡Es el barco más rápido del mundo!», dijo. ## "It's the fastest boat in the world!" he said. ## "Del" = "de + el".
Puso el barco sobre la nariz de la reina. ## He put the boat on the queen's nose.
Todos se quedaron en silencio. ## Everyone stayed silent. ## "Quedarse" means to stay or remain. "En silencio" = in silence.
Entonces Isabella empezó a reír tan fuerte que casi se cayó. ## Then Isabella started to laugh so hard that she almost fell. ## "Empezar a" + verb = to start doing. "Tan... que..." = so... that...
«Me llamo Lucas», dijo el niño con orgullo. ## "My name is Lucas," said the boy proudly. ## "Con orgullo" (with pride) = proudly.
«Y mi barco se llama Valiente», añadió. ## "And my boat is called Valiente," he added. ## "Valiente" means brave.

Isabella pasó toda la tarde con los gemelos. ## Isabella spent the whole afternoon with the twins. ## "Pasar" can mean to pass or to spend time.
Jugó con Lucas a las escondidas detrás de las sillas. ## She played hide-and-seek with Lucas behind the chairs. ## "Las escondidas" = hide-and-seek (in Spain: "el escondite"). "Jugar a" + game.
Escuchó las historias de dragones de Emilia. ## She listened to Emilia's dragon stories.
Cuando el sol bajó, la reina tuvo que irse. ## When the sun went down, the queen had to leave. ## "Tener que" + verb = to have to. "Irse" = to go away, to leave.
«Volveré mañana», prometió. ## "I will come back tomorrow," she promised. ## "Volveré" is the future of "volver": I will return.
Lucas la miró con tristeza. ## Lucas looked at her sadly. ## "Con tristeza" (with sadness) = sadly.
«Todos dicen eso», murmuró. ## "Everyone says that," he whispered.
Emilia tomó la mano de su hermano. ## Emilia took her brother's hand.
Isabella sintió un dolor pequeño en el corazón. ## Isabella felt a small pain in her heart.
«Yo no soy como todos», pensó. ## "I am not like everyone," she thought.
«Yo voy a volver», dijo en voz baja. ## "I am going to come back," she said in a low voice. ## "Ir a" + verb = to be going to do something. "En voz baja" = in a low voice, quietly.
`,
quiz: [
  Q.comp('What was Emilia reading about?', ['Dragons','Queens','Boats','Roses'], '«Es un libro sobre dragones», dijo Emilia.', '"Un libro sobre dragones" = a book about dragons.'),
  Q.comp('What did Lucas do to the queen with his paper boat?', ['He put it on her nose','He gave it to her as a gift','He threw it in the river','He hid it behind a chair'], 'Puso el barco sobre la nariz de la reina.', 'He put the boat on the queen\'s nose, and then she laughed very hard.'),
  Q.comp('What did the queen promise before she left?', ['That she would come back tomorrow','That she would bring a boat','That she would take them to the castle that day','That she would send a letter'], '«Volveré mañana», prometió.', '"Volveré mañana" = I will come back tomorrow. "Prometió" = she promised.'),
  Q.vocab('In the story, "gemelos" means...', ['twins','neighbors','guards','friends'], 'Isabella se sentó en el suelo, cerca de los gemelos.', '"Gemelos" = twins. Emilia and Lucas have the same face.'),
  Q.match([['niña','girl'],['niño','boy'],['hermano','brother'],['tarde','afternoon']]),
  Q.sent('Choose the correct English translation of: "Los dragones no son malos."', ['Dragons are not bad.','Dragons are not many.','The dragons do not have a house.','There are no dragons.'], '«Los dragones no son malos», dijo Emilia.', '"Malos" = bad. "No son malos" = they are not bad.'),
  Q.fill('Me ___ Lucas. (My name is...)', ['llamo'], '«Me llamo Lucas», dijo el niño con orgullo.', '"Me llamo" literally means "I call myself". It is how you say your name.', 'Starts with "ll"'),
  Q.tr('I am going to come back.', ['Yo voy a volver','Voy a volver'], '«Yo voy a volver», dijo en voz baja.', '"Voy a" + verb = I am going to do something. "Volver" = to come back.'),
  Q.short('What is the name of Lucas\'s boat? Write one short sentence (Spanish or English).', 'El barco de Lucas se llama Valiente.')
]
},
/* ───────────── CHAPTER 4 ───────────── */
{
title: 'El rey conoce a los gemelos', titleEn: 'The king meets the twins',
summary: 'Isabella tells Alejandro everything, and the royal couple visit the orphanage together.',
text: `
Esa noche, la reina no pudo dormir. ## That night, the queen could not sleep. ## "Pudo" is the past of "poder" (can). "No pudo dormir" = could not sleep.
Pensaba en Emilia, en Lucas y en el barco de papel. ## She was thinking about Emilia, Lucas and the paper boat. ## "Pensar en" = to think about.
Por la mañana, le contó todo a Alejandro. ## In the morning, she told Alejandro everything. ## "Contó" comes from "contar", which means both "to tell" and "to count". "Le" = to him.
El rey escuchó con mucha atención y no dijo nada. ## The king listened very carefully and said nothing.
Después caminó hasta la ventana y miró el jardín. ## Then he walked to the window and looked at the garden. ## "Hasta" = until or up to.
«Quiero conocer a esos niños», dijo por fin. ## "I want to meet those children," he said at last. ## "Conocer" = to meet someone or to know someone. "Por fin" = at last, finally.

Esa tarde, los reyes fueron juntos al orfanato. ## That afternoon, the king and queen went to the orphanage together. ## "Fueron" is the past of "ir" (to go). "Los reyes" means "the king and queen" together.
El rey llevaba una capa simple y no llevaba corona. ## The king was wearing a simple cape and was not wearing a crown. ## "Llevar" can mean "to wear", "to carry" or "to take".
«No quiero asustar a los niños», explicó. ## "I don't want to scare the children," he explained.
Cuando entraron, Lucas corrió hacia ellos. ## When they came in, Lucas ran toward them. ## "Hacia" = toward.
«¡Volviste, reina!», gritó con alegría. ## "You came back, Queen!" he shouted with joy. ## "Volviste" = you came back (to one person). "Con alegría" = with joy.
Lucas miró al rey y abrió mucho los ojos. ## Lucas looked at the king and opened his eyes wide. ## "Mirar a" + person: we add "a" before a person. "Al" = "a + el".
«¿Y quién es este señor tan alto?», preguntó. ## "And who is this very tall man?" he asked. ## "Tan" before an adjective means "so": "tan alto" = so tall.
«Es mi esposo», respondió Isabella. ## "He is my husband," answered Isabella.
Alejandro se agachó para hablar con el niño. ## Alejandro crouched down to talk with the boy. ## "Agacharse" = to crouch or bend down. "Para" + verb = in order to.
«Hola, Lucas», dijo el rey con una sonrisa. ## "Hello, Lucas," said the king with a smile.
«Mi esposa me contó sobre tu barco». ## "My wife told me about your boat." ## "Me contó" = she told me.
«Dice que es muy rápido». ## "She says that it is very fast."

Lucas pensó un momento. ## Lucas thought for a moment.
«Es rápido», dijo, «pero necesita un puerto». ## "It is fast," he said, "but it needs a port." ## A "puerto" is a harbor or port, a place where boats stop.
Alejandro se rió y miró a Isabella. ## Alejandro laughed and looked at Isabella.
«Tenemos un lago muy grande en el castillo», dijo. ## "We have a very big lake at the castle," he said.
«Tu barco puede navegar allí cuando quieras». ## "Your boat can sail there whenever you want." ## "Cuando quieras" = whenever you want. The ending "-as" shows "you".
Emilia escuchó esto desde su rincón. ## Emilia heard this from her corner. ## "Desde" = from or since.
Cerró su libro de dragones y se acercó despacio. ## She closed her book about dragons and came closer slowly. ## "Acercarse" = to come closer.
«¿Hay dragones en su castillo?», preguntó con voz pequeña. ## "Are there dragons in your castle?" she asked in a small voice. ## "Hay" means "there is" or "there are". It is also how you ask: "¿Hay...?" = "Is there...?"
El rey la miró con mucho respeto. ## The king looked at her with great respect.
«No hay dragones», dijo, «pero hay una biblioteca enorme con cien libros sobre dragones». ## "There are no dragons," he said, "but there is an enormous library with a hundred books about dragons." ## "Cien" = one hundred.
Los ojos de Emilia brillaron como dos estrellas. ## Emilia's eyes shone like two stars. ## "Como" = like or as.
`,
quiz: [
  Q.comp('Why couldn\'t the queen sleep that night?', ['She kept thinking about the twins','She was afraid of dragons','The castle was too noisy','She was waiting for the king'], 'Pensaba en Emilia, en Lucas y en el barco de papel.', 'She was thinking about Emilia, Lucas and the paper boat.'),
  Q.comp('Why wasn\'t the king wearing a crown?', ['He did not want to scare the children','He lost it','It was too heavy','The queen asked him to hide it'], '«No quiero asustar a los niños», explicó.', '"Asustar" = to scare. The king wanted to look simple and friendly.'),
  Q.comp('What does Lucas\'s boat need, according to him?', ['A port','A new sail','A name','A captain'], '«Es rápido», dijo, «pero necesita un puerto».', 'Lucas says: it is fast, but it needs a port.'),
  Q.vocab('What does "hay" mean in "No hay dragones"?', ['there are','they have','he says','you are'], '«No hay dragones», dijo, «pero hay una biblioteca enorme con cien libros sobre dragones».', '"Hay" means "there is / there are".'),
  Q.match([['rey','king'],['esposo','husband'],['lago','lake'],['biblioteca','library']]),
  Q.sent('Choose the correct English translation of: "Mi esposa me contó sobre tu barco."', ['My wife told me about your boat.','My wife counted your boats.','My husband gave me your boat.','My wife and I saw your boat.'], '«Mi esposa me contó sobre tu barco».', '"Contó" comes from "contar": to tell. "Sobre" = about.'),
  Q.fill('Los ojos de Emilia brillaron ___ dos estrellas. (like)', ['como'], 'Los ojos de Emilia brillaron como dos estrellas.', '"Como" = like or as.', 'Starts with "c"'),
  Q.tr('We have a big lake.', ['Tenemos un lago grande','Tenemos un lago muy grande'], '«Tenemos un lago muy grande en el castillo», dijo.', '"Tenemos" = we have. "Lago" is masculine, so "un lago grande".'),
  Q.short('What did Emilia ask the king? Write one short sentence (Spanish or English).', 'Emilia preguntó si hay dragones en el castillo.')
]
},
/* ───────────── CHAPTER 5 ───────────── */
{
title: 'La pregunta más importante', titleEn: 'The most important question',
summary: 'The royal couple decide, and ask the twins to join their family.',
text: `
Durante una semana, los reyes visitaron el orfanato todos los días. ## For a week, the king and queen visited the orphanage every day. ## "Todos los días" = every day.
Alejandro leyó cuentos a los niños. ## Alejandro read stories to the children. ## "Leyó" is the past of "leer".
Isabella ayudó a Margarita en la cocina. ## Isabella helped Margarita in the kitchen.
Lucas siempre tenía una broma nueva para el rey. ## Lucas always had a new joke for the king.
Emilia hacía mil preguntas sobre el castillo, los caballos y la biblioteca. ## Emilia asked a thousand questions about the castle, the horses and the library. ## Spanish says "hacer preguntas" (to make questions) for "to ask questions".
Poco a poco, los cuatro se convirtieron en amigos. ## Little by little, the four of them became friends. ## "Poco a poco" = little by little. "Convertirse en" = to become.

Una noche, el rey y la reina hablaron en el balcón. ## One night, the king and queen talked on the balcony.
«Alejandro, tengo que decirte algo importante», dijo Isabella. ## "Alejandro, I have to tell you something important," said Isabella. ## "Decirte" = decir + te: to tell you. Little words like "te" can attach to the end of the verb.
«Ya lo sé», respondió él con una sonrisa. ## "I already know," he answered with a smile. ## "Ya lo sé" = I already know it. "Sé" (with an accent) is "I know"; "se" (without) is a different word.
«Yo también pienso en ellos todo el día». ## "I also think about them all day long."
«Quiero que sean nuestros hijos». ## "I want them to be our children." ## "Quiero que sean" uses a special verb form ("sean") that appears after "querer que". You will learn this later. For now, remember the whole phrase.
Isabella lloró de felicidad. ## Isabella cried with happiness. ## "Llorar" = to cry. "De felicidad" = from happiness.
«Yo también lo quiero», susurró. ## "I want that too," she whispered.
Pero sabían que primero tenían que preguntar a los niños. ## But they knew that first they had to ask the children.
«Una familia necesita amor y también una decisión de todos», dijo el rey. ## "A family needs love and also a decision from everyone," said the king.

A la mañana siguiente, los reyes llegaron al orfanato con una cesta. ## The next morning, the king and queen arrived at the orphanage with a basket. ## "A la mañana siguiente" = the next morning.
Dentro de la cesta había pan, queso y dos pastelitos de rosa. ## Inside the basket there was bread, cheese and two little rose cakes. ## The ending "-ito / -itos" makes a word small and cute: pastel → pastelito.
Se sentaron con los gemelos en el jardín pequeño del orfanato. ## They sat down with the twins in the small garden of the orphanage.
«Emilia, Lucas, tenemos una pregunta para ustedes», dijo Isabella. ## "Emilia, Lucas, we have a question for you," said Isabella. ## "Ustedes" means "you" for more than one person.
Los niños dejaron de comer. ## The children stopped eating. ## "Dejar de" + verb = to stop doing something.
«¿Quieren vivir en nuestro castillo y ser parte de nuestra familia?», preguntó el rey. ## "Do you want to live in our castle and be part of our family?" asked the king.
Nadie dijo nada por unos segundos. ## Nobody said anything for a few seconds. ## Spanish uses a double negative: "nadie dijo nada" (nobody said nothing).
Lucas miró a Emilia. ## Lucas looked at Emilia.
Emilia miró a Lucas. ## Emilia looked at Lucas.
Los dos tenían lágrimas en los ojos. ## Both of them had tears in their eyes.
«¿Para siempre?», preguntó Emilia con voz temblorosa. ## "Forever?" asked Emilia in a trembling voice. ## "Para siempre" = forever.
«Para siempre», respondieron los reyes al mismo tiempo. ## "Forever," answered the king and queen at the same time. ## "Al mismo tiempo" = at the same time.
Lucas saltó de su silla y abrazó al rey con todas sus fuerzas. ## Lucas jumped from his chair and hugged the king with all his strength. ## "Con todas sus fuerzas" = with all his strength.
«¡Sí, sí, sí!», gritó. ## "Yes, yes, yes!" he shouted.
Emilia abrazó a la reina, no dijo nada y sonrió como una niña feliz. ## Emilia hugged the queen, said nothing, and smiled like a happy girl.
`,
quiz: [
  Q.comp('What did the king and queen do for a week?', ['They visited the orphanage every day','They traveled to another kingdom','They stayed in the castle','They taught Lucas to sail'], 'Durante una semana, los reyes visitaron el orfanato todos los días.', '"Todos los días" = every day.'),
  Q.comp('What did the king and queen need to do before adopting the twins?', ['Ask the children','Ask the village','Write a letter','Wait for the festival'], 'Pero sabían que primero tenían que preguntar a los niños.', 'They knew they had to ask the children first.'),
  Q.comp('What did Emilia ask after the king\'s question?', ['"Forever?"','"Is there a library?"','"Can I bring my book?"','"Where is the castle?"'], '«¿Para siempre?», preguntó Emilia con voz temblorosa.', '"¿Para siempre?" = Forever?'),
  Q.vocab('In "Los niños dejaron de comer", what does "dejaron de" mean?', ['stopped','started','wanted','forgot'], 'Los niños dejaron de comer.', '"Dejar de" + verb = to stop doing something.'),
  Q.match([['cocina','kitchen'],['cesta','basket'],['silla','chair'],['lágrimas','tears']]),
  Q.sent('Choose the correct English translation of: "Poco a poco, los cuatro se convirtieron en amigos."', ['Little by little, the four of them became friends.','A little later, four friends arrived.','The four friends were very small.','Many friends became four.'], 'Poco a poco, los cuatro se convirtieron en amigos.', '"Poco a poco" = little by little. "Convertirse en" = to become.'),
  Q.fill('Los niños dejaron ___ comer. (stopped ___ eating)', ['de'], 'Los niños dejaron de comer.', '"Dejar de" + verb is the pattern for "stop doing something".', 'Two letters'),
  Q.tr('Forever.', ['Para siempre'], '«Para siempre», respondieron los reyes al mismo tiempo.', '"Para siempre" = forever.'),
  Q.short('How did Lucas react to the question? Write one short sentence (Spanish or English).', 'Lucas abrazó al rey con todas sus fuerzas.')
]
},
/* ───────────── CHAPTER 6 ───────────── */
{
title: 'El primer día en el castillo', titleEn: 'The first day at the castle',
summary: 'The twins arrive, find their new room and a funny moment in the armor.',
text: `
Una semana después, los gemelos llegaron al castillo en un carruaje blanco. ## A week later, the twins arrived at the castle in a white carriage. ## "Después" = after or later. "Una semana después" = a week later.
Llevaban poca ropa y un solo libro de dragones. ## They had little clothing and only one book about dragons. ## "Poca ropa" = little clothing. "Ropa" is always singular in Spanish.
Tenían los ojos muy abiertos. ## Their eyes were wide open.
El castillo era mucho más grande que el orfanato. ## The castle was much bigger than the orphanage. ## "Más... que..." = more... than... (bigger than).
«¡Es enorme!», dijo Lucas. ## "It's huge!" said Lucas.
«Aquí podemos jugar a las escondidas por una semana entera», dijo. ## "Here we can play hide-and-seek for a whole week," he said. ## "Entera" means whole or entire.

La reina los llevó a su nueva habitación. ## The queen took them to their new room. ## "Los" here means "them".
Tenía dos camas con mantas rosadas y una ventana grande. ## It had two beds with pink blankets and a big window.
Había un escritorio, una alfombra suave y un estante lleno de libros. ## There was a desk, a soft rug and a shelf full of books. ## "Lleno de" = full of.
Emilia tocó los libros con mucho cuidado. ## Emilia touched the books very carefully. ## "Con cuidado" (with care) = carefully.
«¿Son para mí?», preguntó. ## "Are they for me?" she asked. ## "Mí" (with an accent) is "me" after a preposition.
«Son para los dos», dijo Isabella. ## "They are for both of you," said Isabella.
«Esta es su casa ahora». ## "This is your home now." ## "Su" can mean his, her, their or your (formal). Here it means "your" because she speaks to the twins.
Lucas saltó sobre su cama y la cama hizo un ruido gracioso. ## Lucas jumped on his bed and the bed made a funny noise. ## "Gracioso" means funny. "Hacer un ruido" = to make a noise.

Por la tarde, un sirviente llamado Teodoro enseñó el castillo a los niños. ## In the afternoon, a servant named Teodoro showed the children around the castle. ## "Enseñar" means both "to teach" and "to show". "Llamado" = named, called.
Teodoro era un hombre alto y muy serio. ## Teodoro was a tall and very serious man.
«Aquí está la gran sala», dijo con voz formal. ## "Here is the great hall," he said in a formal voice. ## "Gran" is a short form of "grande" used before a noun: "la gran sala".
«Allí está la cocina», dijo. ## "There is the kitchen," he said.
«Y esta es la armadura del primer rey de las rosas». ## "And this is the armor of the first king of the roses." ## "Primer" is "primero" shortened before a masculine noun.
Lucas miró la armadura gris con curiosidad. ## Lucas looked at the gray armor with curiosity.
Cuando Teodoro dio la espalda, Lucas se metió dentro de la armadura. ## When Teodoro turned his back, Lucas climbed inside the armor. ## "Dar la espalda" literally means "to give the back": to turn one's back. "Meterse" = to get into.
Teodoro siguió caminando y explicando la historia del castillo. ## Teodoro kept walking and explaining the history of the castle. ## "Seguir" + -ando/-iendo = to keep doing something.
De pronto, la armadura dijo con voz profunda: «¡Buenas tardes, Teodoro!» ## Suddenly, the armor said in a deep voice: "Good afternoon, Teodoro!" ## "De pronto" is another way to say "suddenly".
Teodoro saltó y gritó muy fuerte. ## Teodoro jumped and shouted very loudly. ## "Fuerte" means strong or loud.
Emilia se tapó la boca con las manos para no reír. ## Emilia covered her mouth with her hands so she would not laugh. ## "Taparse" = to cover oneself. "Para no reír" = so as not to laugh.
Después de un momento, Teodoro miró dentro de la armadura y vio dos ojos grandes. ## After a moment, Teodoro looked inside the armor and saw two big eyes.
«¡Joven Lucas!», dijo. ## "Young Lucas!" he said.
Para sorpresa de todos, Teodoro empezó a reír. ## To everyone's surprise, Teodoro started to laugh. ## "Para sorpresa de todos" = to everyone's surprise.
«Hace treinta años que nadie hace eso en este castillo», dijo. ## "In thirty years no one has done that in this castle," he said. ## "Hace treinta años que..." means "it has been thirty years since...". It is a common way to say how long ago something happened.
«Me gusta mucho». ## "I like it a lot." ## "Me gusta" literally means "it pleases me". This is how Spanish says "I like".

Esa noche, la familia cenó junta en la gran mesa. ## That night, the family had dinner together at the big table. ## "Cenar" = to have dinner.
Había sopa caliente, pollo, pan fresco y un pastel de manzana. ## There was hot soup, chicken, fresh bread and an apple cake.
Lucas comió tres pedazos de pastel. ## Lucas ate three pieces of cake.
Emilia hablaba poco, pero escuchaba todo. ## Emilia spoke little, but she listened to everything.
Al final, el rey levantó su copa de jugo. ## At the end, the king raised his cup of juice.
«Por la familia», dijo. ## "To the family," he said. ## "Por" is used here for a toast: "Por la familia" = to the family.
«Por la familia», repitieron todos. ## "To the family," everyone repeated.
Antes de dormir, Lucas susurró en la oscuridad: «Emilia, ¿esto es un sueño?» ## Before sleeping, Lucas whispered in the darkness: "Emilia, is this a dream?" ## "Antes de" + verb = before doing something. "Sueño" means both "dream" and "sleep".
«No es un sueño», respondió Emilia. ## "It is not a dream," answered Emilia.
«Es nuestra nueva casa», dijo, y los dos se durmieron sonriendo. ## "It is our new home," she said, and both fell asleep smiling. ## "Dormirse" = to fall asleep. "Sonriendo" = smiling.
`,
quiz: [
  Q.comp('How did the twins arrive at the castle?', ['In a white carriage','On horses','On a boat','On foot'], 'Una semana después, los gemelos llegaron al castillo en un carruaje blanco.', '"Carruaje" = carriage.'),
  Q.comp('What did Lucas do to play a trick on Teodoro?', ['He hid inside the armor','He hid in the kitchen','He stole the key','He dressed as a guard'], 'Cuando Teodoro dio la espalda, Lucas se metió dentro de la armadura.', 'Lucas climbed inside the armor while Teodoro turned his back.'),
  Q.comp('How did Teodoro react in the end?', ['He laughed and said he liked it','He told the king','He cried','He locked Lucas in his room'], 'Para sorpresa de todos, Teodoro empezó a reír.', 'To everyone\'s surprise, he started to laugh. Nobody had done that in thirty years.'),
  Q.vocab('In the story, what does "gracioso" mean?', ['funny','heavy','dangerous','soft'], 'Lucas saltó sobre su cama y la cama hizo un ruido gracioso.', '"Gracioso" = funny.'),
  Q.match([['cama','bed'],['mesa','table'],['sopa','soup'],['noche','night']]),
  Q.sent('Choose the correct English translation of: "Me gusta mucho."', ['I like it a lot.','I am very hungry.','He likes me.','I want a lot.'], '«Me gusta mucho».', '"Me gusta" literally means "it pleases me", which is how Spanish says "I like it".'),
  Q.fill('La familia ___ junta en la gran mesa. (had dinner)', ['cenó'], 'Esa noche, la familia cenó junta en la gran mesa.', '"Cenó" = had dinner (past of "cenar").', 'Starts with "c"'),
  Q.tr('The castle was bigger than the orphanage.', ['El castillo era más grande que el orfanato','El castillo era mucho más grande que el orfanato'], 'El castillo era mucho más grande que el orfanato.', '"Más grande que" = bigger than.'),
  Q.short('What did the family do together that night? Write one short sentence (Spanish or English).', 'La familia cenó junta y levantó una copa por la familia.')
]
},
/* ───────────── CHAPTER 7 ───────────── */
{
title: 'El jardín secreto', titleEn: 'The secret garden',
summary: 'The twins find a golden key and a hidden garden.',
text: `
Una mañana, Emilia encontró una llave pequeña dentro de un libro de la biblioteca. ## One morning, Emilia found a small key inside a book from the library.
La llave era dorada y tenía una rosa en la parte de arriba. ## The key was golden and had a rose on the top. ## "La parte de arriba" = the top part.
«Lucas, mira esto», susurró. ## "Lucas, look at this," she whispered.
«¿Qué abre?», preguntó su hermano. ## "What does it open?" asked her brother.
«No lo sé, pero vamos a descubrirlo», dijo Emilia. ## "I don't know, but we are going to find out," said Emilia. ## "Descubrirlo" = descubrir + lo: to discover it. "Vamos a" + verb = we are going to.

Los gemelos buscaron por todo el castillo. ## The twins searched all over the castle. ## "Por todo el castillo" = all over the castle.
Probaron la llave en la cocina, en la torre y en el establo. ## They tried the key in the kitchen, in the tower and in the stable.
Nada funcionó. ## Nothing worked.
Al final, fueron al jardín de la reina. ## In the end, they went to the queen's garden.
Detrás de un rosal muy grande vieron una pared cubierta de hojas verdes. ## Behind a very big rosebush they saw a wall covered with green leaves. ## "Rosal" is a rose bush. "Vieron" is the past of "ver" (they saw).
Lucas movió las hojas y encontró una puerta vieja de madera. ## Lucas moved the leaves and found an old wooden door. ## "De madera" = made of wood.
Tenía una cerradura con forma de rosa. ## It had a lock in the shape of a rose. ## "Con forma de" = in the shape of.
Emilia puso la llave y la giró. ## Emilia put in the key and turned it. ## "La" here means "it" (the key).
La puerta se abrió con un sonido suave. ## The door opened with a soft sound. ## "Se abrió" = it opened (by itself).

Dentro había un jardín escondido, lleno de flores de todos los colores. ## Inside there was a hidden garden, full of flowers of every color.
Había mariposas azules, un pequeño lago y un banco de piedra. ## There were blue butterflies, a small lake and a stone bench. ## "Un pequeño lago" puts "pequeño" before the noun. It sounds a bit more poetic than "un lago pequeño".
En el centro crecía un rosal blanco con rosas muy grandes. ## In the center grew a white rosebush with very big roses.
«Es el lugar más bonito del mundo», dijo Emilia en voz baja. ## "It is the prettiest place in the world," said Emilia in a low voice.
Un hombre mayor salió de detrás de un árbol con unas tijeras en la mano. ## An older man came out from behind a tree with scissors in his hand. ## "Unas tijeras" = a pair of scissors. "Tijeras" is always plural in Spanish.
«Buenos días», dijo con una sonrisa amable. ## "Good morning," he said with a kind smile.
«Soy Benito, el jardinero de la reina». ## "I am Benito, the queen's gardener."
«Hace años que nadie viene a este jardín». ## "No one has come to this garden for years." ## "Hace años que..." = it has been years since...
«¿Quieren ayudarme a cuidar las rosas?», preguntó. ## "Do you want to help me take care of the roses?" he asked. ## "Ayudarme" = ayudar + me: to help me.

Los gemelos aceptaron con alegría. ## The twins accepted with joy.
Benito les enseñó a regar las plantas y a cortar las hojas secas. ## Benito taught them to water the plants and cut the dry leaves. ## "Enseñar a" + verb = to teach to do something.
«Las rosas son como las personas», explicó el jardinero. ## "Roses are like people," explained the gardener.
«Necesitan agua, sol y mucho cariño». ## "They need water, sun and lots of care." ## "Cariño" can mean affection, love or gentle care.
Emilia pensó en el orfanato y en lo mucho que había cambiado su vida. ## Emilia thought about the orphanage and how much her life had changed. ## "Había cambiado" = had changed. This tense (had + past participle) is common in A2 stories.
Esa tarde, los niños volvieron a casa con las manos sucias y una gran sonrisa. ## That afternoon, the children went back home with dirty hands and a big smile. ## "Volver a" + place = to return to a place.
«¿Dónde estaban?», preguntó la reina. ## "Where were you?" asked the queen. ## "Estaban" here means "you (plural) were".
Emilia y Lucas se miraron y sonrieron. ## Emilia and Lucas looked at each other and smiled. ## "Se miraron" = they looked at each other.
«Es un secreto», dijeron los dos. ## "It's a secret," said both of them.
Isabella sonrió también, porque conocía bien aquel jardín. ## Isabella smiled too, because she knew that garden well. ## "Conocer" = to know a place or a person. "Aquel" = that (over there).
`,
quiz: [
  Q.comp('Where did Emilia find the golden key?', ['Inside a book in the library','Under her bed','In the kitchen','In the queen\'s hat'], 'Una mañana, Emilia encontró una llave pequeña dentro de un libro de la biblioteca.', 'She found it "dentro de un libro de la biblioteca".'),
  Q.comp('Where was the secret door?', ['Behind a big rosebush in the garden','In the tower','In the kitchen','In the library'], 'Detrás de un rosal muy grande vieron una pared cubierta de hojas verdes.', 'They saw a wall covered with leaves behind a very big rosebush.'),
  Q.comp('Who was Benito?', ['The queen\'s gardener','The king\'s servant','A guard','A friend from the orphanage'], '«Soy Benito, el jardinero de la reina».', '"Jardinero" = gardener.'),
  Q.vocab('What does "escondido" mean in "un jardín escondido"?', ['hidden','small','new','dark'], 'Dentro había un jardín escondido, lleno de flores de todos los colores.', '"Escondido" = hidden. It comes from "esconder" (to hide) and "las escondidas" (hide-and-seek).'),
  Q.match([['llave','key'],['hojas','leaves'],['mariposas','butterflies'],['árbol','tree']]),
  Q.sent('Choose the correct English translation of: "Las rosas son como las personas."', ['Roses are like people.','The roses are for the people.','People love roses.','Roses and people are in the garden.'], '«Las rosas son como las personas», explicó el jardinero.', '"Como" = like.'),
  Q.fill('Emilia puso la llave y la ___. (turned it)', ['giró'], 'Emilia puso la llave y la giró.', '"Giró" = turned (past of "girar").', 'Starts with "g"'),
  Q.tr('It is a secret.', ['Es un secreto'], '«Es un secreto», dijeron los dos.', '"Secreto" is masculine, so "un secreto".'),
  Q.short('What did Benito teach the twins? Write one short sentence (Spanish or English).', 'Benito les enseñó a regar las plantas.')
]
},
/* ───────────── CHAPTER 8 ───────────── */
{
title: 'La fiesta de las rosas', titleEn: 'The Festival of Roses',
summary: 'The kingdom meets its new prince and princess.',
text: `
Una vez al año, el reino celebraba la Fiesta de las Rosas. ## Once a year, the kingdom celebrated the Festival of Roses. ## "Una vez" = once (one time). "Al año" = per year.
Ese año, la fiesta era muy especial. ## That year, the festival was very special.
Por primera vez, los reyes presentaban a sus nuevos hijos a todo el reino. ## For the first time, the king and queen were presenting their new children to the whole kingdom. ## "Por primera vez" = for the first time.
Emilia estaba nerviosa. ## Emilia was nervous.
Tenía un vestido blanco con pequeñas rosas rosadas en las mangas. ## She had a white dress with small pink roses on the sleeves.
Lucas llevaba una chaqueta azul, pero tenía el pelo todo despeinado. ## Lucas was wearing a blue jacket, but his hair was all messy. ## "Despeinado" = with messy hair. It comes from "peinar" (to comb).
«No quiero hablar delante de tanta gente», dijo Emilia. ## "I don't want to speak in front of so many people," said Emilia. ## "Tanta gente" = so many people. "Gente" is singular in Spanish.

Isabella se agachó y la miró a los ojos. ## Isabella crouched down and looked her in the eyes.
«No tienes que decir nada difícil», dijo con cariño. ## "You don't have to say anything difficult," she said with affection.
«Solo tienes que ser tú misma». ## "You only have to be yourself." ## "Tú misma" = yourself (feminine). "Tener que" = to have to.
Emilia respiró profundo y asintió. ## Emilia took a deep breath and nodded. ## "Respirar profundo" = to breathe deeply.
Afuera, la plaza estaba llena de personas, música y flores. ## Outside, the square was full of people, music and flowers.
Cuando los reyes salieron al balcón con los gemelos, todos aplaudieron. ## When the king and queen came out onto the balcony with the twins, everyone applauded. ## "Salieron" is the past of "salir" (to go out).
Un niño gritó: «¡Vivan los príncipes Emilia y Lucas!» ## A child shouted: "Long live Princes Emilia and Lucas!" ## "Vivan" is a wish form: "long live". "Príncipes" can mean "princes" or "prince and princess" together.

Lucas, que no tenía miedo de nada, dio un paso adelante. ## Lucas, who was not afraid of anything, took a step forward. ## "Dar un paso" = to take a step.
«¡Hola, a todos!», gritó con una sonrisa enorme. ## "Hello, everyone!" he shouted with an enormous smile.
«Gracias por darnos una casa y una familia». ## "Thank you for giving us a home and a family." ## "Darnos" = dar + nos: to give us.
«Y gracias por las rosas, que huelen muy bien». ## "And thanks for the roses, which smell very good." ## "Huelen" is from "oler" (to smell).
La gente se rió y aplaudió aún más fuerte. ## The people laughed and applauded even louder. ## "Aún más" = even more.
Entonces Emilia dio un paso adelante también. ## Then Emilia took a step forward too.
Su voz era pequeña, pero todos escucharon. ## Her voice was small, but everyone listened.
«Antes yo leía historias sobre familias», dijo. ## "Before, I used to read stories about families," she said. ## "Leía" describes something she used to do again and again.
«Ahora tengo una familia de verdad, y es mejor que cualquier historia». ## "Now I have a real family, and it is better than any story." ## "Mejor que" = better than. "Cualquier" = any.
La reina lloró de felicidad y el rey miró hacia otro lado para esconder sus lágrimas. ## The queen cried with happiness and the king looked away to hide his tears. ## "Hacia otro lado" = to the other side, away.

Esa noche, el cielo se llenó de luces doradas. ## That night, the sky filled with golden lights. ## "Llenarse de" = to fill with.
Toda la familia miró los fuegos artificiales desde la torre más alta. ## The whole family watched the fireworks from the tallest tower. ## "Fuegos artificiales" = fireworks. "La más alta" = the tallest.
Lucas se durmió en los brazos del rey. ## Lucas fell asleep in the king's arms.
Emilia apoyó la cabeza en el hombro de la reina. ## Emilia rested her head on the queen's shoulder.
«Mañana tenemos que buscar más secretos en el castillo», susurró. ## "Tomorrow we have to look for more secrets in the castle," she whispered.
Isabella y Alejandro se miraron y sonrieron. ## Isabella and Alejandro looked at each other and smiled.
En el reino de las rosas, la familia por fin estaba completa. ## In the Kingdom of Roses, the family was finally complete.
Y esa era solo la primera de muchas aventuras. ## And that was only the first of many adventures.
`,
quiz: [
  Q.comp('Why was this year\'s festival special?', ['The king and queen presented their new children','The king became older','A dragon visited','It rained roses'], 'Por primera vez, los reyes presentaban a sus nuevos hijos a todo el reino.', 'It was the first time the kingdom met Emilia and Lucas.'),
  Q.comp('How did Emilia feel before the celebration?', ['Nervous','Angry','Sleepy','Bored'], 'Emilia estaba nerviosa.', '"Nerviosa" = nervous.'),
  Q.comp('What did Emilia say about her family?', ['It was better than any story','It was too big','It was a secret','It was like a dragon'], '«Ahora tengo una familia de verdad, y es mejor que cualquier historia».', 'She used to read about families. Now she has a real one.'),
  Q.vocab('What does "despeinado" mean?', ['with messy hair','with a hat','dressed in blue','very tall'], 'Lucas llevaba una chaqueta azul, pero tenía el pelo todo despeinado.', '"Despeinado" = with messy, uncombed hair.'),
  Q.match([['fiesta','festival / party'],['cielo','sky'],['torre','tower'],['voz','voice']]),
  Q.sent('Choose the correct English translation of: "Gracias por darnos una casa y una familia."', ['Thank you for giving us a home and a family.','Thank you for the house and the dinner.','We want a house and a family.','Thanks for coming to our house.'], '«Gracias por darnos una casa y una familia».', '"Darnos" = to give us.'),
  Q.fill('Hace ___ años que nadie hace eso en este castillo. (thirty)', ['treinta'], '«Hace treinta años que nadie hace eso en este castillo», dijo.', '"Treinta" = thirty. (In chapter 6 Teodoro said this about the armor.)', 'Starts with "t"'),
  Q.tr('Tomorrow we have to look for more secrets.', ['Mañana tenemos que buscar más secretos'], '«Mañana tenemos que buscar más secretos en el castillo», susurró.', '"Tenemos que" + verb = we have to.'),
  Q.short('What did the family do at night? Write one short sentence (Spanish or English).', 'La familia miró los fuegos artificiales desde la torre más alta.')
]
}
  ]
});
