/* ============================================================
   KIU-Learners Pace — Course Content
   Introduction to Computing (ICT 1101)
   5 Modules | 5 Quiz Questions Each
   ============================================================ */

window.COURSE = {
  title: "Introduction to Computing",
  code: "ICT 1101",
  credits: 3,
  modules: [

    /* ═══════════════════════════════════════════════════════
       MODULE 1: History and Evolution of Computers
    ═══════════════════════════════════════════════════════ */
    {
      id: 1,
      title: "History and Evolution of Computers",
      description: "From abacus to artificial intelligence — trace the remarkable journey of computing through the ages.",
      icon: "🏛️",
      duration: "90 mins read",
      content: `
<div class="reading-content">

<h2 id="sec1-1" class="section-anchor">1.1 The Pre-Mechanical Era: Early Counting Tools</h2>
<p>The history of computing stretches back thousands of years before the first electronic machine was ever conceived. Human beings have always sought tools to assist with counting, calculation, and record-keeping. The earliest of these tools were remarkably simple yet transformative for the civilisations that used them.</p>
<p>The <strong>abacus</strong>, often credited as the world's first computing device, originated in ancient Mesopotamia around 2700–2300 BCE. The word "abacus" derives from the Greek <em>abax</em>, meaning "flat surface." Ancient forms consisted of grooves in sand or clay tablets, later evolving into the familiar bead-and-wire frame used across Asia, the Middle East, and Europe. Skilled abacus operators can perform addition, subtraction, multiplication, and division at remarkable speed — even rivalling early electronic calculators for simple arithmetic tasks.</p>
<p>In ancient Egypt and Babylonia, merchants and administrators developed systems of tallying and notation that enabled trade across vast regions. The Inca civilisation of South America used the <strong>quipu</strong>, a system of knotted coloured strings, to record numerical data about populations, agricultural yields, and tribute payments — demonstrating that computing need not rely on mechanical apparatus at all.</p>
<div class="highlight-box">
<strong>💡 Key Insight:</strong> Computing, at its core, is about representing, storing, and manipulating information. Every civilisation in history has devised tools to meet this fundamental need, long before electronics were imagined.
</div>
<p>The 17th century witnessed the first mechanical calculating machines. In 1623, Wilhelm Schickard built what is sometimes considered the first mechanical calculator — a device that could add and subtract six-digit numbers. However, his "Calculating Clock" was never widely used. More influential was <strong>Blaise Pascal's Pascaline</strong> (1642–1645), a gear-driven machine capable of adding and subtracting eight-digit numbers. Pascal invented it to help his father, a tax commissioner, with arithmetic — a genuinely practical motivation that foreshadows the commercial computing revolution three centuries later.</p>
<p>Later, <strong>Gottfried Wilhelm Leibniz</strong> improved on Pascal's design in 1672 with the Stepped Reckoner, which could also multiply and divide. Leibniz was not only an inventor but a mathematical philosopher — he independently developed calculus alongside Newton, and he is credited with one of the most important insights in computing history: the value of the binary number system. Leibniz proposed that all arithmetic could be performed using just two symbols, 0 and 1 — the foundation upon which every modern digital computer is built.</p>

<h2 id="sec1-2" class="section-anchor">1.2 The Mechanical Age: Babbage and the Analytical Engine</h2>
<p>The 19th century produced the visionary work of <strong>Charles Babbage</strong> (1791–1871), an English mathematician and engineer who is widely regarded as the "Father of the Computer." Babbage conceived of two remarkable machines that were far ahead of their time.</p>
<p>The <strong>Difference Engine</strong>, designed in the 1820s, was intended to compute and print mathematical tables automatically, eliminating the human errors that plagued the handwritten tables of the era. Although only a small prototype was built in Babbage's lifetime, his full Difference Engine No. 2 was successfully constructed by the Science Museum in London between 1985 and 1991, proving that his design was entirely sound.</p>
<p>More ambitious still was the <strong>Analytical Engine</strong>, which Babbage began designing in 1837. This machine was conceived as a fully general-purpose mechanical computer — it could be programmed using punched cards (adapted from the Jacquard loom used in textile manufacturing), it had a "store" (memory) and a "mill" (processor), and it could branch conditionally depending on computed results. In modern terms, the Analytical Engine would have been Turing-complete.</p>
<div class="highlight-box">
<strong>👩‍💻 Ada Lovelace — The World's First Programmer:</strong> <strong>Augusta Ada King, Countess of Lovelace</strong> (1815–1852) translated and annotated a French article about the Analytical Engine, adding notes three times longer than the original text. Her Note G contains what is recognised as the world's first algorithm intended for execution by a machine — a method for computing Bernoulli numbers. She also foresaw that such machines could be used for composing music and producing graphics — astonishing foresight for 1843. The programming language <em>Ada</em>, used extensively by the US Department of Defense, is named in her honour.
</div>
<p>Though the Analytical Engine was never completed in Babbage's lifetime due to funding difficulties and engineering limitations of the era, its conceptual design profoundly influenced 20th-century computer scientists, including Alan Turing.</p>

<h2 id="sec1-3" class="section-anchor">1.3 Electromechanical Computers and the First Generation</h2>
<p>The early 20th century saw computing move from purely mechanical gears and levers to electromechanical systems that combined electrical circuits with physical moving parts. During the Second World War, demand for rapid calculation — for ballistics tables, code-breaking, and logistics — drove an extraordinary acceleration in computing development.</p>
<p>In Germany, <strong>Konrad Zuse</strong> built the <strong>Z3</strong> in 1941, the world's first freely programmable electromechanical computer, using telephone relays. It could perform binary floating-point arithmetic and was used for aerodynamic calculations for aircraft design.</p>
<p>In Britain, the urgent need to break German Enigma-encrypted communications led to the development of <strong>Colossus</strong> (1943–1944) at Bletchley Park, under the direction of <strong>Tommy Flowers</strong>. Colossus used vacuum tubes rather than mechanical relays, making it significantly faster. It is now recognised as the world's first programmable electronic digital computer, though its existence was kept secret for decades after the war.</p>
<p>In the United States, <strong>ENIAC</strong> (Electronic Numerical Integrator and Computer), completed in 1945 at the University of Pennsylvania by John Presper Eckert and John Mauchly, was publicly heralded as the first general-purpose electronic digital computer. ENIAC contained 17,468 vacuum tubes, weighed 30 tonnes, and consumed 150 kilowatts of electricity — enough to power a small neighbourhood. Despite these enormous resource requirements, it could perform 5,000 additions per second — a breathtaking speed for its era.</p>
<table>
<tr><th>Machine</th><th>Year</th><th>Technology</th><th>Significance</th></tr>
<tr><td>Z3 (Zuse)</td><td>1941</td><td>Electromechanical relays</td><td>First programmable computer</td></tr>
<tr><td>Colossus</td><td>1943</td><td>Vacuum tubes</td><td>First electronic computer</td></tr>
<tr><td>ENIAC</td><td>1945</td><td>Vacuum tubes</td><td>First general-purpose electronic computer</td></tr>
<tr><td>EDVAC</td><td>1949</td><td>Vacuum tubes</td><td>First stored-program computer</td></tr>
</table>

<h2 id="sec1-4" class="section-anchor">1.4 The Five Generations of Computers</h2>
<p>Computer historians typically divide the evolution of electronic computers into five generations, each defined by a fundamental change in the underlying hardware technology.</p>
<h3>First Generation (1940s–1956): Vacuum Tubes</h3>
<p>First-generation computers relied on <strong>vacuum tubes</strong> (also called thermionic valves) for their switching and amplification functions. These glass tubes, which controlled electrical current, were large, power-hungry, expensive, and prone to failure. Computers of this era filled entire rooms, required air conditioning, and needed constant maintenance as tubes burned out frequently. Programming was done in machine language (binary code) or assembly language, and data was stored on magnetic drums. Key examples include ENIAC, UNIVAC I (the first commercial computer, 1951), and the IBM 701.</p>

<h3>Second Generation (1956–1963): Transistors</h3>
<p>The invention of the <strong>transistor</strong> at Bell Laboratories in 1947 by John Bardeen, Walter Brattain, and William Shockley (who shared the 1956 Nobel Prize in Physics for this discovery) transformed computing. Transistors performed the same switching function as vacuum tubes but were far smaller, more reliable, cooler-running, and energy-efficient. Second-generation computers were smaller, faster, and cheaper than their predecessors. High-level programming languages like FORTRAN (1957) and COBOL (1959) were developed during this era, making programming more accessible. Magnetic core memory replaced magnetic drums for primary storage.</p>

<h3>Third Generation (1964–1971): Integrated Circuits</h3>
<p>The key innovation of the third generation was the <strong>integrated circuit</strong> (IC), developed independently by Jack Kilby of Texas Instruments (1958) and Robert Noyce of Fairchild Semiconductor (1959). An integrated circuit placed multiple transistors and other electronic components on a single chip of silicon, dramatically reducing size and cost while increasing speed and reliability. IBM's System/360 series (1964) epitomised this era — a family of computers that shared a common architecture, allowing programs to run on different models. Operating systems became sophisticated multi-user, multi-programming systems. The keyboard and monitor replaced punched cards and printouts.</p>

<h3>Fourth Generation (1971–present): Microprocessors</h3>
<p>The development of the <strong>microprocessor</strong> — an entire CPU on a single chip — in 1971 by Intel (the Intel 4004, designed largely by Federico Faggin, Ted Hoff, and Stanley Mazor) ushered in the era of personal computing. The microprocessor made computers affordable for individuals and small businesses. The <strong>Altair 8800</strong> (1975) is often cited as the first personal computer; the <strong>Apple II</strong> (1977) and <strong>IBM PC</strong> (1981) brought computing into homes and offices worldwide. Microsoft's DOS and later Windows became dominant operating systems. By the 1990s, the Internet connected millions of computers globally, and the World Wide Web (invented by Tim Berners-Lee in 1989, launched publicly in 1991) transformed how humanity shares information.</p>

<h3>Fifth Generation (1980s–present): Artificial Intelligence</h3>
<p>The fifth generation is characterised by the pursuit of computers that can think, learn, and communicate in natural language — i.e., <strong>artificial intelligence</strong>. While AI research began in the 1950s (Alan Turing proposed the famous Turing Test in 1950), practical AI applications have accelerated dramatically in recent decades. <strong>Machine learning</strong>, in which computers learn from data rather than explicit programming, and <strong>deep learning</strong> (using artificial neural networks with many layers) have produced systems capable of recognising faces, translating languages, diagnosing diseases, driving vehicles, and generating human-quality text and images. Technologies like parallel processing, quantum computing (still emerging), and neuromorphic chips point toward a sixth generation yet to be fully defined.</p>

<h2 id="sec1-5" class="section-anchor">1.5 Alan Turing and the Theoretical Foundations</h2>
<p><strong>Alan Mathison Turing</strong> (1912–1954) is arguably the most important figure in the theoretical foundations of computer science. In his landmark 1936 paper "On Computable Numbers," Turing described an abstract computing machine (now called a Turing Machine) that could simulate any algorithmic process by reading and writing symbols on an infinite tape. He proved that no algorithm can solve the "halting problem" — determining whether any given program will eventually stop or run forever — establishing fundamental limits on what computers can compute.</p>
<p>Turing's wartime work at Bletchley Park contributed directly to breaking the Enigma and Lorenz ciphers, work that historians estimate shortened World War II by two to four years, saving millions of lives. After the war, he designed the ACE (Automatic Computing Engine), one of the first designs for a stored-program computer, and worked on artificial intelligence. His 1950 paper "Computing Machinery and Intelligence" proposed the famous <strong>Turing Test</strong>: if a human interrogator cannot distinguish a machine's responses from a human's, the machine can be considered intelligent. This remains a touchstone of AI philosophy to this day.</p>
<div class="highlight-box">
<strong>🏅 The Turing Award:</strong> The Association for Computing Machinery (ACM) presents the Turing Award annually to individuals who make major technical contributions to computing. It is considered the Nobel Prize of computer science and carries a $1 million prize (sponsored by Google since 2014).
</div>

<h2 id="sec1-6" class="section-anchor">1.6 Computing in Africa: A Growing Story</h2>
<p>Africa's computing history is often overlooked in Eurocentric narratives, yet the continent has produced significant contributions and is today one of the most exciting frontiers of technological development. In the post-independence era of the 1960s and 1970s, universities and governments across Africa began establishing computer centres — Uganda's Makerere University, Kenya's University of Nairobi, and Nigeria's University of Lagos were among the early institutions to acquire mainframe computers for research and administration.</p>
<p>The mobile telecommunications revolution of the 2000s produced globally influential innovations from Africa. <strong>M-Pesa</strong>, launched in Kenya in 2007, became the world's most successful mobile money system, enabling millions of unbanked citizens to participate in the digital economy — a model now emulated worldwide. Today, Uganda, Rwanda, Nigeria, Ghana, Kenya, and South Africa host thriving technology ecosystems. Kampala International University (KIU) is at the forefront of preparing Uganda's next generation of computing professionals equipped to drive this transformation.</p>

<h2 id="sec1-7" class="section-anchor">1.7 Summary</h2>
<blockquote>"We can only see a short distance ahead, but we can see plenty there that needs to be done." — Alan Turing</blockquote>
<p>From the abacus to artificial intelligence, computing has been shaped by an interplay of mathematical theory, engineering ingenuity, economic necessity, and social demand. Understanding this history equips computing students not merely with facts, but with appreciation for the extraordinary human effort behind each incremental advance. The story of computing is, at its heart, the story of humanity's relentless ambition to extend the power of the mind.</p>
<ul>
<li>Early mechanical devices (abacus, Pascaline, Analytical Engine) established the conceptual groundwork.</li>
<li>The five generations mark transitions: vacuum tubes → transistors → integrated circuits → microprocessors → AI.</li>
<li>Alan Turing's theoretical work defines both the power and the limits of computation.</li>
<li>Africa is an active and growing participant in the global computing story.</li>
</ul>

</div>
`,
      quiz: [
        {
          id: "q1-1",
          question: "Who is credited with designing the first general-purpose mechanical computer that included a memory store, a processing unit, and conditional branching — making it conceptually Turing-complete?",
          options: ["Blaise Pascal", "Charles Babbage", "Alan Turing", "Gottfried Leibniz"],
          correct: 1,
          hint: "Review Section 1.2 — The Mechanical Age. Look for the machine designed in 1837 that used punched cards borrowed from the Jacquard loom.",
          hintSection: "sec1-2",
          explanation: "Charles Babbage's Analytical Engine (designed from 1837) was the first conception of a general-purpose mechanical computer with a store (memory), mill (processor), and conditional branching capability."
        },
        {
          id: "q1-2",
          question: "Which of the following correctly identifies the defining technology of Second-Generation computers and the institution where it was invented?",
          options: [
            "The vacuum tube — University of Pennsylvania",
            "The transistor — Bell Laboratories",
            "The integrated circuit — Texas Instruments",
            "The microprocessor — Intel Corporation"
          ],
          correct: 1,
          hint: "Section 1.4 discusses all five generations. The Second Generation (1956–1963) paragraph specifically names the laboratory and the Nobel Prize-winning inventors.",
          hintSection: "sec1-4",
          explanation: "The transistor was invented at Bell Laboratories in 1947 by John Bardeen, Walter Brattain, and William Shockley, ushering in the Second Generation of computers."
        },
        {
          id: "q1-3",
          question: "Ada Lovelace is celebrated as the world's first programmer. What specific algorithm did she write, and for which machine?",
          options: [
            "A sorting algorithm for the Difference Engine",
            "A code-breaking algorithm for the Colossus",
            "An algorithm for computing Bernoulli numbers on the Analytical Engine",
            "A binary conversion algorithm for the ENIAC"
          ],
          correct: 2,
          hint: "Re-read the highlighted box in Section 1.2 about Ada Lovelace. It details what she wrote in 'Note G' of her annotations.",
          hintSection: "sec1-2",
          explanation: "Ada Lovelace's Note G, written in 1843, contains an algorithm for computing Bernoulli numbers intended for execution on Babbage's Analytical Engine — the world's first published algorithm."
        },
        {
          id: "q1-4",
          question: "What was the central significance of Alan Turing's 1936 paper 'On Computable Numbers' for the field of computer science?",
          options: [
            "It described the first physical electronic computer design",
            "It proved that no algorithm can solve the halting problem, establishing fundamental limits of computation",
            "It introduced the binary number system as the basis for digital computing",
            "It proposed the first programming language capable of handling arithmetic"
          ],
          correct: 1,
          hint: "Section 1.5 explains Turing's theoretical contributions. Focus on what the 1936 paper proved about computability.",
          hintSection: "sec1-5",
          explanation: "Turing's 1936 paper introduced the Turing Machine model and proved that the halting problem is undecidable — establishing fundamental limits on what algorithms can compute."
        },
        {
          id: "q1-5",
          question: "M-Pesa, launched in Kenya in 2007, is cited as a computing innovation originating from Africa. What was its primary impact?",
          options: [
            "It was the first African-built supercomputer for weather forecasting",
            "It enabled millions of unbanked citizens to participate in the digital economy through mobile money",
            "It created the first fibre-optic internet backbone connecting East African universities",
            "It developed the first Swahili-language operating system"
          ],
          correct: 1,
          hint: "Section 1.6 — Computing in Africa covers M-Pesa. The paragraph describes specifically what problem it solved.",
          hintSection: "sec1-6",
          explanation: "M-Pesa became the world's most successful mobile money system, enabling millions of unbanked citizens to participate in the digital economy — a model now replicated worldwide."
        }
      ]
    },

    /* ═══════════════════════════════════════════════════════
       MODULE 2: Computer Hardware Components
    ═══════════════════════════════════════════════════════ */
    {
      id: 2,
      title: "Computer Hardware Components",
      description: "Explore the physical building blocks of every computer — from processors and memory to input/output devices.",
      icon: "🖥️",
      duration: "85 mins read",
      content: `
<div class="reading-content">

<h2 id="sec2-1" class="section-anchor">2.1 Understanding Hardware: An Overview</h2>
<p><strong>Hardware</strong> refers to all the physical, tangible components of a computer system — the parts you can see and touch. Every computer, from a smartphone to a supercomputer, consists of hardware that executes instructions stored in software. Understanding hardware is essential for any computing professional because hardware capabilities determine what software can achieve, and hardware limitations must always be considered in system design.</p>
<p>Computer hardware can be categorised into four functional groups: <strong>processing components</strong> (which execute instructions), <strong>memory components</strong> (which store data and instructions), <strong>storage components</strong> (which retain data permanently), and <strong>input/output components</strong> (which enable interaction with users and other systems). All these groups are interconnected via the <strong>motherboard</strong>, the main circuit board that serves as the backbone of the system.</p>
<div class="highlight-box">
<strong>📐 The Von Neumann Architecture:</strong> Most modern computers follow the design proposed by mathematician John von Neumann in 1945, which stores both data and program instructions in the same memory — the "stored-program" concept. This architecture consists of: a Central Processing Unit (CPU), Memory, Input/Output mechanisms, and a bus system connecting them all.
</div>

<h2 id="sec2-2" class="section-anchor">2.2 The Central Processing Unit (CPU)</h2>
<p>The <strong>Central Processing Unit (CPU)</strong> is the brain of the computer — the component responsible for executing program instructions. Every computation, from a simple addition to rendering a video game scene, is ultimately performed by the CPU. Understanding the CPU's architecture is fundamental to understanding how computers work.</p>
<h3>CPU Components</h3>
<p>The CPU contains several key components working in concert:</p>
<ul>
<li><strong>Arithmetic Logic Unit (ALU):</strong> Performs all arithmetic operations (addition, subtraction, multiplication, division) and logical operations (comparisons such as AND, OR, NOT, greater-than, less-than). The ALU is the computational workhorse of the CPU.</li>
<li><strong>Control Unit (CU):</strong> Directs the operations of all other components by fetching instructions from memory, decoding them, and sending control signals to execute them. The Control Unit acts as the CPU's orchestra conductor.</li>
<li><strong>Registers:</strong> Extremely fast, small storage locations within the CPU itself. Registers hold data that is currently being processed. Common registers include the Accumulator (holds the result of arithmetic), Program Counter (holds the address of the next instruction), and Instruction Register (holds the current instruction being executed).</li>
<li><strong>Cache Memory:</strong> A small, ultra-fast memory built directly into or very close to the CPU. Cache stores frequently-used data and instructions to reduce the time spent fetching from slower main memory. Modern CPUs have multiple cache levels (L1, L2, L3) with L1 being the fastest and smallest, and L3 being slower but larger.</li>
</ul>
<h3>The Fetch-Decode-Execute Cycle</h3>
<p>The CPU operates on a continuous <strong>fetch-decode-execute cycle</strong> (also called the instruction cycle or machine cycle):</p>
<ol>
<li><strong>Fetch:</strong> The Control Unit reads the next instruction from memory at the address stored in the Program Counter, then increments the Program Counter.</li>
<li><strong>Decode:</strong> The fetched instruction is decoded — the Control Unit determines what operation is required and which operands (data) are involved.</li>
<li><strong>Execute:</strong> The ALU (or other unit) carries out the instruction, and the result is stored in a register or written back to memory.</li>
</ol>
<h3>CPU Performance Metrics</h3>
<p><strong>Clock speed</strong>, measured in Gigahertz (GHz), indicates how many cycles the CPU can perform per second. A 3.5 GHz CPU can execute 3.5 billion cycles per second. However, clock speed alone does not determine performance — the number of instructions executed per cycle (IPC), the number of processor cores, and cache efficiency all contribute significantly. Modern CPUs also employ techniques such as <strong>pipelining</strong> (beginning the fetch of the next instruction before the current one finishes), <strong>branch prediction</strong>, and <strong>out-of-order execution</strong> to maximise throughput.</p>
<p>Multi-core processors integrate two or more complete CPU cores on a single chip, enabling true parallel processing. An 8-core CPU can theoretically execute eight instruction streams simultaneously, dramatically improving performance for multi-threaded applications.</p>

<h2 id="sec2-3" class="section-anchor">2.3 Memory: RAM and ROM</h2>
<p>Computer memory stores data and instructions. It is critical to distinguish between <strong>primary memory</strong> (directly accessible to the CPU) and <strong>secondary storage</strong> (mass storage devices). Primary memory comes in two fundamental types: RAM and ROM.</p>
<h3>Random Access Memory (RAM)</h3>
<p><strong>RAM (Random Access Memory)</strong> is the computer's primary working memory — the workspace where the CPU stores data it is actively processing. The term "random access" means the CPU can read from or write to any memory location in approximately the same time, regardless of its physical position.</p>
<p>RAM is <strong>volatile</strong> — it loses all its contents when the power is switched off. When you open a document, it is loaded from the hard drive into RAM; if the power fails before you save, the unsaved changes are lost. RAM is measured in gigabytes (GB); modern personal computers typically have 8–32 GB of RAM, while servers may have terabytes.</p>
<p>There are two main types of RAM in modern computers:</p>
<ul>
<li><strong>DRAM (Dynamic RAM):</strong> Used for main memory. Must be refreshed thousands of times per second to retain data, making it slower and more power-hungry, but it is inexpensive and high-capacity. Modern main memory uses DDR (Double Data Rate) DRAM — DDR4 and DDR5 are current standards.</li>
<li><strong>SRAM (Static RAM):</strong> Used for CPU cache. Does not require constant refreshing, making it much faster than DRAM, but it is also significantly more expensive and physically larger. Typically only megabytes of SRAM are present in a system.</li>
</ul>
<h3>Read-Only Memory (ROM)</h3>
<p><strong>ROM (Read-Only Memory)</strong> stores firmware — permanent instructions that do not change during normal computer operation. ROM is <strong>non-volatile</strong> — it retains its contents without power. In personal computers, the ROM chip contains the <strong>BIOS</strong> (Basic Input/Output System) or its modern replacement, <strong>UEFI</strong> (Unified Extensible Firmware Interface), which is the first program that runs when you power on a computer. BIOS/UEFI performs a POST (Power-On Self-Test) to check hardware and then loads the operating system from storage.</p>
<p>Modern variants of ROM include <strong>EEPROM</strong> (Electrically Erasable Programmable ROM) and <strong>Flash memory</strong> (used in USB drives and SSDs), which can be written to under controlled conditions but retain data without power.</p>

<h2 id="sec2-4" class="section-anchor">2.4 Secondary Storage Devices</h2>
<p>Secondary storage provides <strong>permanent, large-capacity data retention</strong>. Unlike RAM, storage devices retain data when powered off. They are slower than RAM but can hold vastly more data at much lower cost per gigabyte.</p>
<h3>Hard Disk Drives (HDD)</h3>
<p>HDDs store data magnetically on spinning platters coated with a ferromagnetic material. A read/write head moves across the platter surface on an actuator arm, magnetising tiny regions to represent 0s and 1s. HDDs offer very high capacities (1–20 TB or more) at low cost but are relatively slow due to mechanical movement (seek time, rotational latency) and are vulnerable to physical shock. Common speeds are 5,400 and 7,200 RPM (revolutions per minute).</p>
<h3>Solid State Drives (SSD)</h3>
<p>SSDs store data in NAND flash memory cells with no moving parts. They are dramatically faster than HDDs (read speeds of 500 MB/s for SATA SSDs, up to 7,000 MB/s for NVMe SSDs), quieter, more durable, and more energy-efficient. SSDs are now standard in laptops and desktops. Their main disadvantage is higher cost per gigabyte compared to HDDs.</p>
<h3>Optical Drives and Removable Media</h3>
<p>CDs, DVDs, and Blu-ray discs store data using laser-burned pits and lands on a reflective surface. USB flash drives (thumb drives) use NAND flash memory in a portable form factor. Memory cards (SD, microSD) are used in cameras and smartphones. Cloud storage (Google Drive, Dropbox, OneDrive) offers virtually unlimited capacity accessible from any device.</p>

<h2 id="sec2-5" class="section-anchor">2.5 Input and Output Devices</h2>
<p><strong>Input devices</strong> allow users and external systems to send data into the computer. <strong>Output devices</strong> allow the computer to communicate results to users or other systems. Some devices serve both functions (input/output or I/O devices).</p>
<table>
<tr><th>Category</th><th>Device</th><th>Function</th></tr>
<tr><td>Input</td><td>Keyboard</td><td>Alphanumeric and command entry</td></tr>
<tr><td>Input</td><td>Mouse / Trackpad</td><td>Pointing and clicking</td></tr>
<tr><td>Input</td><td>Microphone</td><td>Audio capture</td></tr>
<tr><td>Input</td><td>Scanner / Camera</td><td>Image and document digitisation</td></tr>
<tr><td>Input</td><td>Touchscreen</td><td>Direct touch interaction</td></tr>
<tr><td>Output</td><td>Monitor / Display</td><td>Visual output</td></tr>
<tr><td>Output</td><td>Speakers / Headphones</td><td>Audio output</td></tr>
<tr><td>Output</td><td>Printer</td><td>Physical document production</td></tr>
<tr><td>Output</td><td>Projector</td><td>Large-area visual display</td></tr>
<tr><td>I/O</td><td>Network Interface Card</td><td>Send/receive network data</td></tr>
<tr><td>I/O</td><td>Touchscreen</td><td>Display and touch input</td></tr>
</table>
<h3>Display Technology</h3>
<p>Modern monitors use <strong>LCD</strong> (Liquid Crystal Display) or <strong>OLED</strong> (Organic Light-Emitting Diode) panels. Key display characteristics include resolution (the number of pixels — e.g., 1920×1080 Full HD, 3840×2160 4K Ultra HD), refresh rate (how many frames per second the display can show — 60Hz, 144Hz, etc.), response time, and colour accuracy. OLED displays produce true blacks and vivid colours because each pixel generates its own light, unlike LCD which requires a backlight.</p>

<h2 id="sec2-6" class="section-anchor">2.6 The Motherboard and System Bus</h2>
<p>The <strong>motherboard</strong> (also called the mainboard or system board) is the primary printed circuit board in a computer. It provides the electrical connections, sockets, and slots through which all other components communicate. A motherboard includes:</p>
<ul>
<li><strong>CPU socket:</strong> The physical connector for the processor (e.g., Intel LGA1700, AMD AM5).</li>
<li><strong>RAM slots (DIMM slots):</strong> Hold memory modules.</li>
<li><strong>PCIe slots:</strong> Connect expansion cards such as the GPU (graphics card), sound card, and NVMe SSD.</li>
<li><strong>SATA ports:</strong> Connect HDDs and SATA SSDs.</li>
<li><strong>Power connectors:</strong> Receive power from the PSU (Power Supply Unit).</li>
<li><strong>Chipset:</strong> A set of microchips that manages data flow between the CPU, memory, and peripheral devices.</li>
<li><strong>BIOS/UEFI chip:</strong> The ROM chip storing firmware.</li>
</ul>
<p>The <strong>system bus</strong> is the set of electrical pathways (wires/traces on the PCB) that transfer data between components. It has three parts: the <strong>data bus</strong> (carries data), the <strong>address bus</strong> (specifies memory addresses), and the <strong>control bus</strong> (carries control signals from the CPU).</p>

<h2 id="sec2-7" class="section-anchor">2.7 The Graphics Processing Unit (GPU)</h2>
<p>The <strong>GPU (Graphics Processing Unit)</strong> was originally designed to render graphics — handling the intensive parallel computations needed to draw millions of polygons and apply lighting, shading, and texture effects in real time. A modern GPU contains thousands of small processor cores optimised for parallel tasks, compared to a CPU's fewer but more powerful cores optimised for sequential tasks.</p>
<p>Today, GPUs are used far beyond graphics. <strong>GPGPU computing</strong> (General-Purpose computing on GPU) applies GPU parallelism to scientific simulation, machine learning training, cryptocurrency mining, and video encoding. NVIDIA's CUDA platform and AMD's ROCm allow programmers to harness GPU compute power in applications unrelated to graphics. The GPUs in NVIDIA's A100 and H100 data-centre products are the engines powering modern AI systems including large language models like GPT and Gemini.</p>

<h2 id="sec2-8" class="section-anchor">2.8 Summary</h2>
<p>Computer hardware is an elegantly interconnected system. Each component has a specific role, and the performance of the overall system depends on the balance and integration of all parts.</p>
<ul>
<li>The <strong>CPU</strong> is the brain — it executes instructions via the fetch-decode-execute cycle.</li>
<li><strong>RAM</strong> is fast, volatile working memory; <strong>ROM</strong> holds permanent firmware.</li>
<li>Secondary storage (HDD, SSD) provides permanent, high-capacity data retention.</li>
<li>Input/output devices enable communication between computer and user.</li>
<li>The <strong>motherboard</strong> interconnects all components via the system bus.</li>
<li>The <strong>GPU</strong> accelerates parallel computation, now fundamental to AI.</li>
</ul>
</div>
`,
      quiz: [
        {
          id: "q2-1",
          question: "Within the CPU, which component is solely responsible for fetching instructions from memory, decoding them, and sending control signals to direct the operations of all other components?",
          options: ["Arithmetic Logic Unit (ALU)", "L2 Cache", "Control Unit (CU)", "Program Counter Register"],
          correct: 2,
          hint: "Re-read Section 2.2 — The Central Processing Unit. The CPU Components list describes each part. One is described as 'the CPU's orchestra conductor.'",
          hintSection: "sec2-2",
          explanation: "The Control Unit (CU) fetches instructions from memory, decodes them, and sends control signals to execute them — it directs all other CPU operations."
        },
        {
          id: "q2-2",
          question: "What is the fundamental difference between DRAM and SRAM, and why is each used in its particular application within a computer?",
          options: [
            "DRAM is non-volatile and used for ROM; SRAM is volatile and used for main memory",
            "DRAM requires constant refresh and is used for main memory; SRAM does not refresh and is faster, used for CPU cache",
            "DRAM is used in SSDs; SRAM is used in HDDs",
            "DRAM is faster and more expensive; SRAM is slower and cheaper"
          ],
          correct: 1,
          hint: "Section 2.3 has a clear comparison of DRAM and SRAM under the RAM section. Look at the bullet points describing each type.",
          hintSection: "sec2-3",
          explanation: "DRAM requires constant refreshing, is less expensive, and is used for main memory (RAM). SRAM needs no refresh, is much faster but more expensive, and is used for CPU cache."
        },
        {
          id: "q2-3",
          question: "Which statement most accurately describes the advantage of an SSD over an HDD for use as a computer's primary storage?",
          options: [
            "SSDs store data magnetically on spinning platters, offering higher capacity per pound",
            "SSDs use NAND flash memory with no moving parts, providing dramatically faster read speeds and greater durability",
            "SSDs are the only storage medium capable of retaining data without power",
            "SSDs are cheaper per gigabyte and therefore preferred for data centres"
          ],
          correct: 1,
          hint: "Section 2.4 compares HDDs and SSDs. The SSD paragraph specifically lists their advantages over HDDs.",
          hintSection: "sec2-4",
          explanation: "SSDs use NAND flash with no moving parts, giving dramatically faster speeds (up to 7,000 MB/s for NVMe), greater durability, quieter operation, and better energy efficiency than HDDs."
        },
        {
          id: "q2-4",
          question: "The system bus connects all components on the motherboard. What is the specific function of the ADDRESS BUS within the system bus?",
          options: [
            "It carries the actual data being transferred between components",
            "It carries control signals from the CPU to coordinate operations",
            "It specifies the memory locations (addresses) from which data should be read or written",
            "It routes network traffic from the NIC to the CPU"
          ],
          correct: 2,
          hint: "The end of Section 2.6 defines the three parts of the system bus — data bus, address bus, and control bus — and their individual functions.",
          hintSection: "sec2-6",
          explanation: "The address bus specifies memory addresses — it tells other components which location in memory the data should be read from or written to."
        },
        {
          id: "q2-5",
          question: "Modern GPUs have thousands of small processor cores, compared to the CPU's fewer but more powerful cores. This makes GPUs especially well-suited for which category of tasks?",
          options: [
            "Sequential, single-threaded tasks requiring complex logic",
            "Fetching and decoding complex instructions quickly",
            "Managing operating system processes and memory allocation",
            "Massively parallel tasks such as AI training, scientific simulation, and graphics rendering"
          ],
          correct: 3,
          hint: "Section 2.7 on GPUs explains the architectural difference between GPU and CPU cores, and what that difference means for the kinds of tasks each excels at.",
          hintSection: "sec2-7",
          explanation: "GPUs' thousands of small parallel cores make them ideal for massively parallel tasks — graphics rendering, AI model training, scientific simulation, and cryptocurrency mining."
        }
      ]
    },

    /* ═══════════════════════════════════════════════════════
       MODULE 3: Software and Operating Systems
    ═══════════════════════════════════════════════════════ */
    {
      id: 3,
      title: "Computer Software and Operating Systems",
      description: "Discover the invisible layer that brings hardware to life — from operating systems to application software and programming languages.",
      icon: "💾",
      duration: "88 mins read",
      content: `
<div class="reading-content">

<h2 id="sec3-1" class="section-anchor">3.1 What is Software?</h2>
<p><strong>Software</strong> is the set of instructions, programs, and data that tell computer hardware what to do. If hardware is the body of a computer, software is its mind. Without software, even the most powerful hardware is an inert collection of metal, silicon, and plastic. Software ranges from the operating system that manages hardware resources to the word processor you use to write a document, to the embedded firmware in a microwave oven's control panel.</p>
<p>Software is fundamentally different from hardware in that it is <strong>non-physical and easily reproducible</strong>. A single set of instructions (a program) can be copied and run on millions of machines simultaneously without degradation. This characteristic makes software both enormously valuable and uniquely vulnerable to piracy and unauthorised copying.</p>
<div class="highlight-box">
<strong>📋 Types of Software at a Glance:</strong>
<ul style="margin-top:8px;">
<li><strong>System Software:</strong> Manages hardware and provides a platform for other software (OS, device drivers, utilities).</li>
<li><strong>Application Software:</strong> Performs tasks directly for end users (word processors, browsers, games).</li>
<li><strong>Programming Tools:</strong> Enable programmers to create new software (compilers, IDEs, debuggers).</li>
<li><strong>Middleware:</strong> Connects different software systems or components (web servers, database connectors).</li>
</ul>
</div>

<h2 id="sec3-2" class="section-anchor">3.2 Operating Systems: The Master Program</h2>
<p>The <strong>Operating System (OS)</strong> is the most fundamental piece of software on any computer. It acts as an intermediary between users and applications on one side, and the physical hardware on the other. Without an OS, every application would need to include code for directly managing the keyboard, display, disk, and every other piece of hardware — an enormously impractical task. The OS abstracts this complexity, providing a consistent interface that applications can use regardless of the specific hardware.</p>
<p>The OS is loaded into memory first when you power on a computer (by the BIOS/UEFI firmware) and it remains running for the entire session, managing all other software and hardware interactions.</p>

<h2 id="sec3-3" class="section-anchor">3.3 Core Functions of an Operating System</h2>
<h3>1. Process Management</h3>
<p>A <strong>process</strong> is a program in execution. Modern operating systems are <strong>multitasking</strong> — they can run multiple processes apparently simultaneously on a single CPU by rapidly switching between them (time-sharing or time-slicing). The OS scheduler decides which process runs on the CPU and for how long, balancing responsiveness and efficiency. The OS also handles process creation, termination, communication between processes (inter-process communication), and synchronisation to prevent conflicts when multiple processes access shared resources.</p>

<h3>2. Memory Management</h3>
<p>The OS manages the allocation of RAM among all running processes. It tracks which memory regions are in use, allocates memory when a process requests it, and frees memory when a process terminates. <strong>Virtual memory</strong> is a technique where the OS uses disk space as an extension of RAM, allowing systems to run programs that collectively require more memory than is physically available. The OS uses a <strong>paging</strong> or <strong>segmentation</strong> mechanism to move data between RAM and the disk's virtual memory (swap file) as needed.</p>

<h3>3. File System Management</h3>
<p>The OS organises data on storage devices using a <strong>file system</strong> — a structured method for naming, storing, and retrieving files. Common file systems include NTFS (Windows), ext4 (Linux), and APFS (macOS). The OS provides a hierarchical directory structure (folders within folders) and manages permissions — determining which users can read, write, or execute each file. The OS also handles file creation, deletion, copying, and moving, providing a uniform interface regardless of whether the underlying storage is an HDD, SSD, or USB drive.</p>

<h3>4. Device Management (Device Drivers)</h3>
<p>The OS manages all input/output devices through <strong>device drivers</strong> — specialised software modules that translate the OS's generic I/O commands into the device-specific commands understood by each hardware component. When you plug in a printer, the OS loads the appropriate driver to communicate with it. Drivers run in the kernel (the core of the OS) with privileged access to hardware.</p>

<h3>5. Security and Access Control</h3>
<p>The OS enforces security policies through <strong>user authentication</strong> (passwords, biometrics, multi-factor authentication), <strong>access control lists</strong> (specifying permissions for each user and group), and <strong>privilege separation</strong> (distinguishing between administrator/root privileges and standard user privileges to limit damage from errors or malicious software). Modern OSes also include firewalls, encryption support, and secure boot capabilities.</p>

<h3>6. User Interface</h3>
<p>The OS provides a <strong>user interface</strong> through which users and applications interact with the system. This may be a <strong>Command-Line Interface (CLI)</strong> — where users type text commands — or a <strong>Graphical User Interface (GUI)</strong> — featuring windows, icons, menus, and a pointer (WIMP paradigm). Modern OSes typically provide both.</p>

<h2 id="sec3-4" class="section-anchor">3.4 Major Operating Systems</h2>
<h3>Microsoft Windows</h3>
<p>First released in 1985 as a graphical shell for MS-DOS, Windows has become the dominant desktop OS worldwide, holding approximately 70–75% of the global desktop market share. Key versions include Windows 95 (which popularised the Start button and taskbar), Windows XP (widely considered the most reliable pre-Vista release), Windows 7, Windows 10, and the current Windows 11 (released 2021). Windows is owned and developed by Microsoft Corporation.</p>

<h3>Linux</h3>
<p>Linux is a free, open-source OS kernel created by <strong>Linus Torvalds</strong> in 1991 as a Unix-like system for personal computers. Linux is developed collaboratively by thousands of contributors worldwide and is distributed under the GNU General Public License (GPL). Linux dominates in servers (powering over 90% of the world's top supercomputers and the majority of web servers), cloud computing (Amazon Web Services, Google Cloud, Microsoft Azure all run on Linux), and embedded systems (routers, smart TVs, in-vehicle infotainment). Linux is also the foundation of Android — the world's most-used mobile OS.</p>
<p>Linux comes in many <strong>distributions (distros)</strong> — Ubuntu, Debian, Fedora, Arch Linux, CentOS — each packaging the kernel with different desktop environments, utilities, and software repositories.</p>

<h3>macOS</h3>
<p>macOS (formerly Mac OS X) is Apple's proprietary operating system for Macintosh computers, first released in 2001. It is built on a Unix foundation (Darwin/BSD), offering both a polished GUI and access to a powerful CLI. macOS is known for its stability, security, and tight integration with Apple hardware and other Apple services (iPhone, iPad, iCloud). Current versions include macOS Sonoma (2023) and Sequoia (2024).</p>

<h3>Android and iOS</h3>
<p>Mobile computing is dominated by two platforms: <strong>Android</strong> (Google/AOSP, based on Linux, ~72% global mobile market share) and <strong>iOS</strong> (Apple, ~27%). Android is open-source and licensed to device manufacturers; iOS is exclusive to Apple's iPhone and iPad. Both provide sophisticated mobile operating environments with app stores, touch-based GUIs, and deep integration with cloud services.</p>

<h2 id="sec3-5" class="section-anchor">3.5 Application Software</h2>
<p><strong>Application software</strong> (or simply "apps") are programs designed to perform specific tasks for end users, as opposed to managing the computer itself. The diversity of application software is extraordinary:</p>
<ul>
<li><strong>Productivity suites:</strong> Microsoft Office (Word, Excel, PowerPoint), Google Workspace (Docs, Sheets, Slides), LibreOffice</li>
<li><strong>Web browsers:</strong> Chrome, Firefox, Safari, Edge</li>
<li><strong>Database management systems:</strong> Microsoft SQL Server, MySQL, PostgreSQL, Oracle Database</li>
<li><strong>Media software:</strong> VLC, Audacity, Adobe Premiere, GIMP</li>
<li><strong>Communication:</strong> Microsoft Teams, Zoom, WhatsApp, Telegram</li>
<li><strong>Scientific and engineering:</strong> MATLAB, R, AutoCAD, SolidWorks</li>
<li><strong>Educational software:</strong> Learning Management Systems (Moodle, Blackboard, KIU-Learners Pace)</li>
</ul>
<p>Software licencing determines how software may be used and distributed. <strong>Proprietary software</strong> restricts use and modification (e.g., Microsoft Office). <strong>Open-source software</strong> provides source code freely (e.g., Linux, LibreOffice). <strong>Freeware</strong> is free to use but not necessarily open-source. <strong>Shareware</strong> is free for a trial period. <strong>SaaS</strong> (Software as a Service) delivers software over the internet on a subscription basis (e.g., Google Workspace, Salesforce).</p>

<h2 id="sec3-6" class="section-anchor">3.6 Programming Languages</h2>
<p>Programming languages enable humans to write instructions that computers can execute. Languages exist at different <strong>levels of abstraction</strong>:</p>
<h3>Low-Level Languages</h3>
<p><strong>Machine language</strong> (binary — sequences of 0s and 1s) is the only language the CPU directly executes. <strong>Assembly language</strong> uses symbolic mnemonics (e.g., <code>MOV AX, 5</code>) that map one-to-one to machine instructions. An <strong>assembler</strong> translates assembly to machine code. Low-level languages are fast and efficient but extremely tedious and hardware-specific.</p>
<h3>High-Level Languages</h3>
<p>High-level languages are closer to human language, abstracting away hardware details. They are translated to machine code by a <strong>compiler</strong> (which translates the entire program at once, producing an executable — e.g., C, C++, Rust, Go) or an <strong>interpreter</strong> (which translates and executes one statement at a time — e.g., Python, Ruby, JavaScript).</p>
<table>
<tr><th>Language</th><th>Primary Use</th><th>Paradigm</th></tr>
<tr><td>Python</td><td>AI/ML, data science, scripting, web</td><td>Multi-paradigm</td></tr>
<tr><td>Java</td><td>Enterprise applications, Android</td><td>Object-oriented</td></tr>
<tr><td>C/C++</td><td>Systems programming, games, embedded</td><td>Procedural/OO</td></tr>
<tr><td>JavaScript</td><td>Web front-end and back-end (Node.js)</td><td>Event-driven, OO</td></tr>
<tr><td>SQL</td><td>Database queries</td><td>Declarative</td></tr>
<tr><td>Swift/Kotlin</td><td>iOS/Android app development</td><td>Object-oriented</td></tr>
</table>

<h2 id="sec3-7" class="section-anchor">3.7 Summary</h2>
<p>Software is the intelligence of the computer. The operating system manages hardware resources, provides security, and gives applications a stable platform. Application software serves end users across every conceivable domain. Programming languages are the tools through which developers create all software.</p>
<ul>
<li>Software types: system, application, programming tools, middleware.</li>
<li>The OS manages processes, memory, file systems, devices, security, and the user interface.</li>
<li>Major OSes: Windows (desktop), Linux (servers/cloud), macOS (Apple), Android/iOS (mobile).</li>
<li>Programming languages range from machine code to high-level, each with specific strengths and use cases.</li>
</ul>
</div>
`,
      quiz: [
        {
          id: "q3-1",
          question: "Which of the following best describes the concept of 'Virtual Memory' as implemented by an operating system?",
          options: [
            "A special type of high-speed RAM used exclusively by the OS kernel",
            "A method where the OS uses disk space as an extension of physical RAM, allowing programs to use more memory than physically available",
            "Memory that is permanently reserved for graphics processing",
            "The section of ROM that stores the operating system itself"
          ],
          correct: 1,
          hint: "Section 3.3 covers OS functions. The Memory Management subsection specifically defines virtual memory and the paging/segmentation mechanism.",
          hintSection: "sec3-3",
          explanation: "Virtual memory uses disk space as an extension of RAM via paging/segmentation, allowing systems to run programs that collectively need more memory than physically available."
        },
        {
          id: "q3-2",
          question: "Linus Torvalds created Linux in 1991. Which statement most accurately describes why Linux dominates in servers and cloud computing environments?",
          options: [
            "Linux is owned by Microsoft and is therefore standard in corporate environments",
            "Linux requires a paid licence from IBM, ensuring enterprise-grade support",
            "Linux is free, open-source, stable, and highly customisable, making it ideal for servers and cloud platforms",
            "Linux was designed exclusively for server use and cannot run on personal computers"
          ],
          correct: 2,
          hint: "Section 3.4 discusses major operating systems. The Linux paragraph explains why it dominates in servers and cloud computing.",
          hintSection: "sec3-4",
          explanation: "Linux's free, open-source nature, stability, and customisability make it ideal for servers and cloud. It powers over 90% of supercomputers and most web servers worldwide."
        },
        {
          id: "q3-3",
          question: "A compiler and an interpreter both translate high-level language code to machine code, but they differ in how they do it. What is the key operational difference?",
          options: [
            "A compiler translates code to assembly language only; an interpreter translates to binary directly",
            "A compiler translates the entire program at once to an executable; an interpreter translates and executes one statement at a time",
            "Compilers are used for web languages; interpreters are used for desktop applications",
            "A compiler requires internet access; an interpreter works offline"
          ],
          correct: 1,
          hint: "Section 3.6 on programming languages defines both compilers and interpreters in the High-Level Languages subsection with specific examples.",
          hintSection: "sec3-6",
          explanation: "A compiler translates the entire program at once, producing a standalone executable (C, C++, Rust). An interpreter translates and executes one statement at a time (Python, Ruby, JavaScript)."
        },
        {
          id: "q3-4",
          question: "Device drivers are a core component of OS device management. What is their primary purpose?",
          options: [
            "They store user files on the hard disk in an organised directory structure",
            "They translate the OS's generic I/O commands into device-specific commands understood by each hardware component",
            "They manage the allocation of RAM between running processes",
            "They enforce security policies by authenticating users before login"
          ],
          correct: 1,
          hint: "Section 3.3, under Device Management, defines what a device driver is and what it does. Look for what a driver 'translates.'",
          hintSection: "sec3-3",
          explanation: "Device drivers translate the OS's generic I/O commands into the device-specific language each hardware component understands, enabling the OS to communicate with any device."
        },
        {
          id: "q3-5",
          question: "In software licencing, what is the defining characteristic of 'open-source software' that distinguishes it from proprietary software?",
          options: [
            "Open-source software is always free of charge and cannot be sold commercially",
            "Open-source software provides its source code freely, allowing users to view, modify, and distribute it",
            "Open-source software can only run on Linux operating systems",
            "Open-source software is developed exclusively by government agencies"
          ],
          correct: 1,
          hint: "Section 3.5 on Application Software defines different software licencing types — look for the sentence defining open-source specifically.",
          hintSection: "sec3-5",
          explanation: "Open-source software provides its source code freely, allowing users to study, modify, and distribute it. Examples include Linux, LibreOffice, and Firefox."
        }
      ]
    },

    /* ═══════════════════════════════════════════════════════
       MODULE 4: Data Representation and Number Systems
    ═══════════════════════════════════════════════════════ */
    {
      id: 4,
      title: "Data Representation and Number Systems",
      description: "Understand how computers represent numbers, text, images, and sound using the binary language of 0s and 1s.",
      icon: "🔢",
      duration: "80 mins read",
      content: `
<div class="reading-content">

<h2 id="sec4-1" class="section-anchor">4.1 Why Computers Use Binary</h2>
<p>Everything in a digital computer — every character you type, every pixel on your screen, every note in a song — is ultimately represented as sequences of <strong>binary digits (bits)</strong>: 0 and 1. This may seem like an extreme limitation, but it is the foundation of an extraordinarily powerful and reliable system. Understanding why requires examining how computers work at the hardware level.</p>
<p>Electronic circuits operate with voltage — electrical potential measured in volts. A circuit can be in one of two easily distinguishable states: <strong>high voltage</strong> (typically 3.3V or 5V, representing 1) or <strong>low voltage</strong> (near 0V, representing 0). Representing two states reliably is straightforward with transistors. Representing 10 distinct states (as decimal requires) would be far more difficult, prone to errors from electrical noise, and harder to build reliably. Binary is therefore not a limitation but a profound engineering choice.</p>
<p>A single binary digit is called a <strong>bit</strong> (binary digit). Eight bits form a <strong>byte</strong>. From a single byte, 2⁸ = 256 distinct values can be represented (0 to 255). Larger units:</p>
<table>
<tr><th>Unit</th><th>Abbreviation</th><th>Size</th></tr>
<tr><td>Kilobyte</td><td>KB</td><td>1,024 bytes (2¹⁰)</td></tr>
<tr><td>Megabyte</td><td>MB</td><td>1,024 KB (2²⁰ ≈ 1 million bytes)</td></tr>
<tr><td>Gigabyte</td><td>GB</td><td>1,024 MB (2³⁰ ≈ 1 billion bytes)</td></tr>
<tr><td>Terabyte</td><td>TB</td><td>1,024 GB (2⁴⁰ ≈ 1 trillion bytes)</td></tr>
<tr><td>Petabyte</td><td>PB</td><td>1,024 TB</td></tr>
</table>

<h2 id="sec4-2" class="section-anchor">4.2 The Binary Number System (Base-2)</h2>
<p>The <strong>binary number system</strong> uses only two symbols (0 and 1) and operates in base-2. Each position in a binary number represents a power of 2, increasing from right to left.</p>
<p>Consider the binary number <code>1011</code>:</p>
<ul>
<li>Position 3 (leftmost): 1 × 2³ = 1 × 8 = <strong>8</strong></li>
<li>Position 2: 0 × 2² = 0 × 4 = <strong>0</strong></li>
<li>Position 1: 1 × 2¹ = 1 × 2 = <strong>2</strong></li>
<li>Position 0 (rightmost): 1 × 2⁰ = 1 × 1 = <strong>1</strong></li>
<li>Total: 8 + 0 + 2 + 1 = <strong>11 in decimal</strong></li>
</ul>
<div class="highlight-box">
<strong>📐 Binary to Decimal Conversion Rule:</strong> Write out the binary number. Assign powers of 2 to each bit position from right (2⁰) to left. Multiply each bit by its positional value and sum the results.
</div>
<h3>Decimal to Binary Conversion</h3>
<p>To convert decimal 45 to binary: repeatedly divide by 2 and record the remainders:</p>
<ul>
<li>45 ÷ 2 = 22 remainder <strong>1</strong></li>
<li>22 ÷ 2 = 11 remainder <strong>0</strong></li>
<li>11 ÷ 2 = 5 remainder <strong>1</strong></li>
<li>5 ÷ 2 = 2 remainder <strong>1</strong></li>
<li>2 ÷ 2 = 1 remainder <strong>0</strong></li>
<li>1 ÷ 2 = 0 remainder <strong>1</strong></li>
<li>Reading remainders bottom-to-top: <strong>101101₂</strong></li>
</ul>
<p>Verification: 32+0+8+4+0+1 = 45 ✓</p>

<h3>Binary Arithmetic</h3>
<p>Binary addition follows simple rules: 0+0=0, 0+1=1, 1+0=1, 1+1=10 (0 carry 1). For example:</p>
<ul>
<li><code>1010</code> (10) + <code>0111</code> (7) = <code>10001</code> (17)</li>
</ul>
<p>Subtraction uses <strong>two's complement</strong> representation, which allows subtraction to be performed using addition circuits — an elegant design that simplifies CPU hardware significantly.</p>

<h2 id="sec4-3" class="section-anchor">4.3 The Hexadecimal Number System (Base-16)</h2>
<p>Binary is the native language of computers, but it is very verbose for humans — representing a single byte requires 8 binary digits. <strong>Hexadecimal (hex, base-16)</strong> provides a compact, human-readable notation. Hex uses 16 symbols: 0–9 for values zero through nine, and A–F for values ten through fifteen.</p>
<table>
<tr><th>Decimal</th><th>Binary</th><th>Hexadecimal</th></tr>
<tr><td>0</td><td>0000</td><td>0</td></tr>
<tr><td>5</td><td>0101</td><td>5</td></tr>
<tr><td>10</td><td>1010</td><td>A</td></tr>
<tr><td>12</td><td>1100</td><td>C</td></tr>
<tr><td>15</td><td>1111</td><td>F</td></tr>
<tr><td>16</td><td>0001 0000</td><td>10</td></tr>
<tr><td>255</td><td>1111 1111</td><td>FF</td></tr>
</table>
<p>Each hex digit represents exactly 4 binary bits (a <strong>nibble</strong>). This makes conversion between hex and binary trivial: group the binary number into sets of four from right, then convert each group to its hex equivalent. For example: binary <code>1011 1110</code> = hex <code>BE</code>.</p>
<p>Hexadecimal is used extensively in computing: colour codes in web design (<code>#1A6B3C</code> is KIU's green), memory addresses, machine code listings, and IPv6 network addresses.</p>

<h2 id="sec4-4" class="section-anchor">4.4 Text Representation: ASCII and Unicode</h2>
<p>How does a computer store the letter 'A' or the word "Kampala"? By mapping characters to numbers, and storing those numbers in binary.</p>
<h3>ASCII</h3>
<p><strong>ASCII (American Standard Code for Information Interchange)</strong>, standardised in 1963, maps 128 characters to 7-bit binary values. The character 'A' is ASCII code 65 (binary: 1000001), 'a' is 97, '0' is 48, and so on. ASCII covers the English alphabet, digits 0–9, punctuation, and control characters (like newline, tab, backspace). It was sufficient for English-language computing but could not represent the vast majority of the world's written languages.</p>
<h3>Unicode and UTF-8</h3>
<p><strong>Unicode</strong> is the universal character standard, designed to encode every character from every writing system in the world — currently over 149,000 characters covering 161 modern and historic scripts, emoji, mathematical symbols, and more. Unicode assigns each character a unique <strong>code point</strong> (e.g., U+0041 for 'A', U+0041 is hex 0041).</p>
<p><strong>UTF-8</strong> is the most widely used Unicode encoding, representing characters using 1–4 bytes. ASCII characters require only 1 byte in UTF-8 (backward compatible), while characters from less-common scripts may require 2, 3, or 4 bytes. Over 98% of all web pages use UTF-8 encoding.</p>
<p>The practical significance: if you open a text file created on a Windows computer in a Ugandan office using a legacy encoding, you may see garbled characters (mojibake). Unicode/UTF-8 solves this problem by providing a universal standard all systems can agree on.</p>

<h2 id="sec4-5" class="section-anchor">4.5 Representing Images, Audio, and Video</h2>
<h3>Images</h3>
<p>Digital images are represented as grids of <strong>pixels</strong> (picture elements), each assigned a colour value. In a <strong>24-bit colour</strong> system (RGB), each pixel uses 3 bytes — one each for Red, Green, and Blue intensity (0–255 per channel). This allows 256³ ≈ 16.7 million distinct colours. A 1920×1080 Full HD image contains 2,073,600 pixels; uncompressed, this requires about 6 MB of storage.</p>
<p>Image compression reduces file sizes dramatically. <strong>JPEG</strong> compression is <em>lossy</em> — it discards some image information (imperceptible to most viewers) to achieve very high compression ratios (10:1 to 100:1). <strong>PNG</strong> uses <em>lossless</em> compression — all original data is retained, but compression ratios are lower.</p>
<h3>Audio</h3>
<p>Sound is captured by converting continuous (analogue) sound waves into digital data through <strong>sampling</strong> — measuring the sound wave's amplitude thousands of times per second. The <strong>sampling rate</strong> (measured in Hz) determines the range of frequencies captured. CD audio uses 44,100 samples per second (44.1 kHz) — sufficient to represent frequencies up to ~22 kHz, covering human hearing range (20 Hz–20 kHz). The <strong>bit depth</strong> determines the precision of each sample (CD audio: 16-bit, giving 65,536 amplitude levels).</p>
<h3>Video</h3>
<p>Digital video is a sequence of still images (frames) displayed rapidly enough to create the illusion of motion. Standard frame rates are 24 fps (cinema), 30 fps (broadcast TV), or 60 fps (gaming). Uncompressed 4K video at 60 fps would require approximately 12 Gbps — impractical for storage or streaming. Video codecs (H.264, H.265/HEVC, AV1) apply sophisticated compression to reduce this to manageable bitrates (4–25 Mbps for high-quality streaming).</p>

<h2 id="sec4-6" class="section-anchor">4.6 Data Types in Programming</h2>
<p>Programming languages categorise data into <strong>data types</strong> that specify what kind of information is stored and what operations are valid. Common data types include:</p>
<ul>
<li><strong>Integer (int):</strong> Whole numbers (e.g., 42, -17). Typically 32-bit or 64-bit, representing ranges of ±2 billion or ±9 quintillion.</li>
<li><strong>Float/Double:</strong> Numbers with decimal points, stored using IEEE 754 floating-point standard. <em>Float</em> is 32-bit (about 7 decimal digits of precision); <em>double</em> is 64-bit (~15 digits). Floating-point arithmetic can introduce tiny rounding errors — important in financial and scientific computing.</li>
<li><strong>Character (char):</strong> A single character, typically stored as a Unicode code point.</li>
<li><strong>String:</strong> A sequence of characters (e.g., "Kampala International University").</li>
<li><strong>Boolean:</strong> A single bit representing true (1) or false (0). Named after mathematician George Boole.</li>
<li><strong>Array:</strong> An ordered collection of values of the same type.</li>
</ul>

<h2 id="sec4-7" class="section-anchor">4.7 Summary</h2>
<p>Data representation is the bridge between the physical world of electrons and the conceptual world of information. Every piece of data in a computer is ultimately binary, but the layers of encoding — number systems, character standards, image and audio formats, data types — allow us to work with the full richness of human expression and scientific measurement.</p>
<ul>
<li>Binary (base-2) is the foundation: two states, two symbols, unlimited complexity.</li>
<li>Hexadecimal (base-16) is binary's compact notation for human readability.</li>
<li>ASCII and Unicode encode text; UTF-8 is the universal web standard.</li>
<li>Images (pixels + RGB), audio (sampling + bit depth), and video (frames + codecs) each have specialised representations and compression methods.</li>
</ul>
</div>
`,
      quiz: [
        {
          id: "q4-1",
          question: "Convert the binary number 11001010 to its decimal equivalent. Show your reasoning.",
          options: ["194", "202", "210", "198"],
          correct: 1,
          hint: "Section 4.2 explains binary-to-decimal conversion. Assign powers of 2 to each bit position from right (2⁰) to left (2⁷), multiply each bit by its positional value, and sum only where bits are 1.",
          hintSection: "sec4-2",
          explanation: "11001010: 128+64+0+0+8+0+2+0 = 202. Positions: bit7=1(128), bit6=1(64), bit5=0, bit4=0, bit3=1(8), bit2=0, bit1=1(2), bit0=0."
        },
        {
          id: "q4-2",
          question: "Why is hexadecimal (base-16) notation preferred over binary when programmers inspect memory addresses or colour codes?",
          options: [
            "Hexadecimal is faster for computers to process than binary",
            "Each hex digit represents exactly 4 binary bits, making hex far more compact and human-readable than long binary strings",
            "Hexadecimal avoids the need for two's complement representation",
            "Hexadecimal uses the same symbols as decimal (0–9) so no training is required"
          ],
          correct: 1,
          hint: "Section 4.3 explains the relationship between hex and binary. Look for the sentence about how many binary bits each hex digit represents.",
          hintSection: "sec4-3",
          explanation: "Each hex digit represents exactly 4 binary bits (a nibble), so an 8-bit byte needs only 2 hex digits instead of 8 binary digits — far more compact and readable."
        },
        {
          id: "q4-3",
          question: "What limitation of ASCII led to the development of Unicode, and how does UTF-8 address practical compatibility concerns?",
          options: [
            "ASCII used too many bits per character; Unicode reduced this to 4 bits",
            "ASCII only covered English characters; Unicode encodes all world scripts. UTF-8 remains backward-compatible with ASCII using 1–4 variable-length bytes",
            "ASCII could not represent numbers; Unicode added numeric encoding",
            "ASCII was proprietary to IBM; Unicode is open-source"
          ],
          correct: 1,
          hint: "Section 4.4 covers ASCII and Unicode. Look at what ASCII could not represent, and specifically how UTF-8 maintains backward compatibility.",
          hintSection: "sec4-4",
          explanation: "ASCII only covers 128 characters (English + basic symbols). Unicode encodes 149,000+ characters from all world scripts. UTF-8 is backward-compatible with ASCII and uses 1–4 bytes per character."
        },
        {
          id: "q4-4",
          question: "In digital audio, what do the terms 'sampling rate' and 'bit depth' refer to, and why does CD audio use 44.1 kHz sampling?",
          options: [
            "Sampling rate is the number of channels; bit depth is the compression ratio. 44.1 kHz was chosen to match AM radio bandwidth",
            "Sampling rate measures amplitude thousands of times per second; bit depth sets precision. 44.1 kHz captures up to ~22 kHz, covering human hearing",
            "Sampling rate and bit depth both refer to compression algorithms; 44.1 kHz is a legal standard",
            "Sampling rate is the file size in kilobytes; 44.1 kHz means the file is 44,100 KB"
          ],
          correct: 1,
          hint: "Section 4.5 under the Audio heading explains both terms. It specifically gives CD audio figures and explains why 44.1 kHz is sufficient for human hearing.",
          hintSection: "sec4-5",
          explanation: "Sampling rate is how many times per second the sound wave is measured. Bit depth is precision per sample. 44.1 kHz captures up to ~22 kHz frequencies, covering the full human hearing range."
        },
        {
          id: "q4-5",
          question: "Which statement correctly explains why floating-point data types can introduce rounding errors in computing?",
          options: [
            "Floating-point numbers are stored in hexadecimal, which cannot represent fractions exactly",
            "The IEEE 754 standard uses a finite number of bits to represent an infinite range of real numbers, causing precision limitations",
            "Floating-point operations require division, which always produces rounding in binary",
            "Float and double types are stored as text strings, which introduces character encoding errors"
          ],
          correct: 1,
          hint: "Section 4.6 on Data Types mentions floating-point rounding errors in the Float/Double bullet point. Think about what finite bits mean for representing infinite real numbers.",
          hintSection: "sec4-6",
          explanation: "IEEE 754 uses a finite number of bits (32 or 64) to approximate real numbers — since there are infinite real numbers between any two values, many cannot be represented exactly, causing tiny rounding errors."
        }
      ]
    },

    /* ═══════════════════════════════════════════════════════
       MODULE 5: Networks, Internet, and Cybersecurity
    ═══════════════════════════════════════════════════════ */
    {
      id: 5,
      title: "Networks, Internet, and Cybersecurity",
      description: "Explore how computers connect, communicate, and how we protect information in an interconnected digital world.",
      icon: "🌐",
      duration: "92 mins read",
      content: `
<div class="reading-content">

<h2 id="sec5-1" class="section-anchor">5.1 Introduction to Computer Networks</h2>
<p>A <strong>computer network</strong> is a collection of two or more computing devices interconnected by communication links to share resources and information. Networks have transformed computing from a solitary activity into the backbone of modern civilisation — enabling email, video calls, e-commerce, cloud computing, social media, and the global knowledge exchange of the World Wide Web.</p>
<p>The fundamental components of any network are: <strong>nodes</strong> (the devices — computers, phones, printers, servers), <strong>links</strong> (the communication channels connecting nodes — wired or wireless), and <strong>network devices</strong> (switches, routers, access points that manage traffic).</p>
<div class="highlight-box">
<strong>🔗 Why Networks Matter:</strong> Without networking, every computer would be an island. Networking enables: resource sharing (printers, storage, software licences), communication (email, messaging), information access (web), collaboration (cloud documents), and distributed computing (splitting large tasks across many machines).
</div>

<h2 id="sec5-2" class="section-anchor">5.2 Types of Networks by Geographic Scope</h2>
<h3>Personal Area Network (PAN)</h3>
<p>A <strong>PAN</strong> covers the smallest area — typically the space around an individual (a few metres). Bluetooth connections between a smartphone and wireless earbuds, or between a laptop and a wireless keyboard, are PANs. PANs use technologies like Bluetooth (IEEE 802.15.1) and NFC (Near-Field Communication).</p>

<h3>Local Area Network (LAN)</h3>
<p>A <strong>LAN</strong> connects devices within a limited geographic area — a home, office, school, or campus building. LANs typically use <strong>Ethernet</strong> (IEEE 802.3) for wired connections or <strong>Wi-Fi</strong> (IEEE 802.11) for wireless. LANs offer high bandwidth (100 Mbps to 10 Gbps), low latency, and low error rates. The KIU campus network is a LAN (or a campus-area network, a LAN variant covering multiple buildings).</p>

<h3>Metropolitan Area Network (MAN)</h3>
<p>A <strong>MAN</strong> spans a city or metropolitan area — typically 5–50 km. City-wide Wi-Fi networks, cable TV networks, and the interconnections between a company's multiple offices within the same city are examples of MANs. Technologies include WiMAX (IEEE 802.16) and fibre-optic rings.</p>

<h3>Wide Area Network (WAN)</h3>
<p>A <strong>WAN</strong> spans large geographic areas — countries or continents. The Internet is the world's largest WAN. Private WANs connect an organisation's offices across different cities or countries using leased lines, MPLS (Multiprotocol Label Switching), or VPNs (Virtual Private Networks). WANs use technologies including DSL, cable, fibre, 4G/5G cellular, and satellite (including Starlink's LEO satellite constellation).</p>

<h2 id="sec5-3" class="section-anchor">5.3 Network Topologies</h2>
<p>Network <strong>topology</strong> refers to the physical or logical arrangement of nodes and links in a network.</p>
<table>
<tr><th>Topology</th><th>Description</th><th>Advantages</th><th>Disadvantages</th></tr>
<tr><td><strong>Bus</strong></td><td>All nodes share a single cable</td><td>Simple, cheap</td><td>Single point of failure, congestion</td></tr>
<tr><td><strong>Star</strong></td><td>All nodes connect to a central switch/hub</td><td>Easy to manage, isolated failures</td><td>Central switch is critical</td></tr>
<tr><td><strong>Ring</strong></td><td>Nodes form a closed loop</td><td>Equal access, predictable performance</td><td>One failure can break the ring</td></tr>
<tr><td><strong>Mesh</strong></td><td>Every node connects to multiple others</td><td>Highly redundant, fault-tolerant</td><td>Expensive, complex</td></tr>
<tr><td><strong>Tree</strong></td><td>Hierarchical branches from a root</td><td>Scalable, organised</td><td>Root failure disrupts all</td></tr>
</table>
<p>Most enterprise networks use a <strong>star topology</strong> at the access layer (connecting individual devices to switches), with a <strong>mesh</strong> of switches and routers at the core for redundancy.</p>

<h2 id="sec5-4" class="section-anchor">5.4 Network Protocols: The Language of Networks</h2>
<p>A <strong>protocol</strong> is a set of rules governing how data is formatted, transmitted, received, and acknowledged across a network. Protocols ensure that devices from different manufacturers, running different operating systems, can communicate reliably. Protocols are organised into layers, with each layer handling a specific aspect of communication.</p>

<h3>The TCP/IP Model</h3>
<p>The <strong>TCP/IP model</strong> (Transmission Control Protocol / Internet Protocol) is the fundamental protocol suite of the Internet. It has four layers:</p>
<ol>
<li><strong>Application Layer:</strong> Protocols used by applications — HTTP/HTTPS (web), SMTP/IMAP (email), FTP (file transfer), DNS (domain name resolution), SSH (secure shell).</li>
<li><strong>Transport Layer:</strong> Manages end-to-end communication. <strong>TCP</strong> provides reliable, ordered, error-checked delivery (used by HTTP, email, file transfers). <strong>UDP</strong> provides fast, connectionless delivery without guarantees (used by video streaming, online gaming, DNS).</li>
<li><strong>Internet Layer:</strong> Handles routing of packets across networks. The <strong>IP protocol</strong> assigns addresses and routes packets. IPv4 uses 32-bit addresses (e.g., 192.168.1.1); IPv6 uses 128-bit addresses (e.g., 2001:0db8::1) to accommodate the enormous number of Internet-connected devices.</li>
<li><strong>Network Access Layer:</strong> Handles physical transmission of data — Ethernet frames, Wi-Fi signals, fibre-optic light pulses.</li>
</ol>

<h3>DNS: The Internet's Phone Book</h3>
<p>The <strong>Domain Name System (DNS)</strong> translates human-readable domain names (www.kiu.ac.ug) into IP addresses (e.g., 197.156.74.10) that routers use to direct traffic. Without DNS, users would need to memorise numerical IP addresses for every website.</p>

<h3>HTTP and HTTPS</h3>
<p><strong>HTTP (Hypertext Transfer Protocol)</strong> governs the exchange of web pages between browsers and servers. <strong>HTTPS</strong> (HTTP Secure) adds <strong>TLS (Transport Layer Security)</strong> encryption, ensuring that data exchanged between browser and server cannot be intercepted or tampered with. HTTPS is identified by the padlock icon in browsers and is now essentially mandatory — Google's Chrome marks all non-HTTPS sites as "Not Secure."</p>

<h2 id="sec5-5" class="section-anchor">5.5 The Internet and World Wide Web</h2>
<p>The <strong>Internet</strong> and the <strong>World Wide Web</strong> are related but distinct concepts that are frequently confused.</p>
<ul>
<li>The <strong>Internet</strong> is the global physical network infrastructure — the interconnected system of routers, cables (including transoceanic undersea cables), and wireless links that connect billions of devices worldwide. It is the "plumbing."</li>
<li>The <strong>World Wide Web (WWW)</strong> is an information system built on top of the Internet, consisting of interlinked documents (web pages) accessible via URLs and transmitted using HTTP. It was invented by <strong>Sir Tim Berners-Lee</strong> at CERN in 1989 and launched publicly in 1991. The Web is one of many services running on the Internet — others include email, VoIP, gaming, cloud storage, and IoT communications.</li>
</ul>
<p>Key Internet technologies:</p>
<ul>
<li><strong>Cloud Computing:</strong> Delivering computing services (servers, storage, databases, software) over the Internet. Major providers: Amazon Web Services (AWS), Microsoft Azure, Google Cloud Platform. Cloud models include IaaS (Infrastructure as a Service), PaaS (Platform as a Service), and SaaS (Software as a Service).</li>
<li><strong>Internet of Things (IoT):</strong> The network of physical devices embedded with sensors and software that connect to the Internet — smart meters, wearables, smart traffic lights, agricultural sensors. Globally, there are now more IoT devices than humans.</li>
<li><strong>5G:</strong> The fifth generation of mobile network technology, offering peak speeds of 10 Gbps, ultra-low latency (<1 ms), and massive device density. Uganda's telecoms (MTN, Airtel) are actively deploying 5G infrastructure.</li>
</ul>

<h2 id="sec5-6" class="section-anchor">5.6 Cybersecurity: Protecting Digital Assets</h2>
<p><strong>Cybersecurity</strong> encompasses the technologies, processes, and practices designed to protect computers, networks, programs, and data from unauthorised access, damage, or attack. As our dependence on digital systems grows, cybersecurity has become one of the most critical fields in computing.</p>

<h3>Common Cyber Threats</h3>
<ul>
<li><strong>Malware:</strong> Malicious software including viruses (self-replicating, attaching to files), worms (self-propagating across networks), trojans (disguised as legitimate software), ransomware (encrypts victim's data and demands ransom), spyware (secretly collects user information), and adware.</li>
<li><strong>Phishing:</strong> Deceptive communications (emails, SMS, websites) that impersonate trusted entities to steal credentials or financial information. Spear-phishing targets specific individuals with personalised messages.</li>
<li><strong>Man-in-the-Middle (MitM) Attack:</strong> An attacker secretly intercepts and potentially alters communications between two parties who believe they are communicating directly.</li>
<li><strong>Denial of Service (DoS) / DDoS:</strong> Overwhelming a server or network with traffic to make it unavailable to legitimate users. Distributed DoS (DDoS) uses many compromised machines (a botnet).</li>
<li><strong>SQL Injection:</strong> Inserting malicious SQL code into input fields to manipulate a database — potentially exposing or destroying all its data.</li>
<li><strong>Social Engineering:</strong> Manipulating people rather than systems to gain access to sensitive information — exploiting human psychology rather than technical vulnerabilities.</li>
</ul>

<h3>Cybersecurity Principles: The CIA Triad</h3>
<p>Information security is built on three core principles, known as the <strong>CIA Triad</strong>:</p>
<ul>
<li><strong>Confidentiality:</strong> Ensuring that information is accessible only to authorised individuals. Achieved through encryption, access controls, and authentication.</li>
<li><strong>Integrity:</strong> Ensuring that information is accurate and has not been tampered with. Achieved through checksums, digital signatures, and version control.</li>
<li><strong>Availability:</strong> Ensuring that systems and data are accessible when needed by authorised users. Achieved through redundancy, backups, and disaster recovery planning.</li>
</ul>

<h3>Protective Measures</h3>
<ul>
<li><strong>Encryption:</strong> Transforming data into an unreadable form using an algorithm and key. AES-256 is the gold standard for symmetric encryption; RSA and ECC are used for asymmetric encryption (public/private key pairs).</li>
<li><strong>Firewalls:</strong> Monitor and control incoming/outgoing network traffic based on security rules.</li>
<li><strong>Multi-Factor Authentication (MFA):</strong> Requires two or more forms of verification (something you know + something you have + something you are).</li>
<li><strong>VPN (Virtual Private Network):</strong> Creates an encrypted tunnel over a public network, securing communications for remote workers.</li>
<li><strong>Regular Software Updates and Patching:</strong> Closing known vulnerabilities before attackers exploit them — the most cost-effective security measure.</li>
</ul>

<h2 id="sec5-7" class="section-anchor">5.7 Digital Citizenship and Ethics</h2>
<p>Being a responsible user of digital technology involves understanding and respecting ethical principles. <strong>Digital citizenship</strong> encompasses:</p>
<ul>
<li><strong>Intellectual Property:</strong> Respecting software licences and copyright — piracy harms developers and the broader digital ecosystem.</li>
<li><strong>Privacy:</strong> Understanding how personal data is collected, stored, and used — and the right to control one's own information. The EU's GDPR (General Data Protection Regulation) and Uganda's Data Protection and Privacy Act (2019) establish legal frameworks for this.</li>
<li><strong>Netiquette:</strong> Respectful behaviour in online communication — avoiding cyberbullying, hate speech, and deliberate misinformation.</li>
<li><strong>Digital Divide:</strong> The gap between those with and without access to digital technology. In Africa, mobile internet has dramatically narrowed this gap, but significant disparities remain between urban and rural populations.</li>
</ul>

<h2 id="sec5-8" class="section-anchor">5.8 Summary</h2>
<p>Networks and the Internet have fundamentally transformed human society, enabling instantaneous global communication, the digital economy, and cloud-based computing. Cybersecurity is the essential discipline that keeps this interconnected world safe from an ever-evolving landscape of threats.</p>
<ul>
<li>Networks are classified by size: PAN, LAN, MAN, WAN.</li>
<li>The TCP/IP model provides the four-layer protocol framework of the Internet.</li>
<li>The Internet is the global network infrastructure; the WWW is one service running on it.</li>
<li>The CIA Triad (Confidentiality, Integrity, Availability) is the foundation of cybersecurity.</li>
<li>Digital citizenship requires ethical, responsible behaviour in all online interactions.</li>
</ul>
</div>
`,
      quiz: [
        {
          id: "q5-1",
          question: "A company has offices in Kampala, Nairobi, and Lagos, all connected through leased fibre lines managed by the company's IT department. What type of network best describes this interconnection?",
          options: [
            "Local Area Network (LAN) — because it uses fibre-optic cables",
            "Personal Area Network (PAN) — because it is company-owned",
            "Wide Area Network (WAN) — because it spans multiple countries",
            "Metropolitan Area Network (MAN) — because all three cities are in Africa"
          ],
          correct: 2,
          hint: "Section 5.2 defines each network type by geographic scope. The WAN definition specifically mentions countries and continents, and gives private WAN as an example.",
          hintSection: "sec5-2",
          explanation: "A network spanning multiple countries (Kampala, Nairobi, Lagos) is a WAN. Private WANs connect an organisation's offices across cities or countries using leased lines or MPLS."
        },
        {
          id: "q5-2",
          question: "What is the specific role of the Transport Layer in the TCP/IP model, and what is the key difference between TCP and UDP at this layer?",
          options: [
            "The Transport Layer routes packets across the Internet. TCP is faster; UDP is slower but more reliable",
            "The Transport Layer manages end-to-end communication. TCP is reliable and ordered; UDP is fast but without delivery guarantees",
            "The Transport Layer handles physical signal transmission. TCP uses Wi-Fi; UDP uses Ethernet",
            "The Transport Layer runs application protocols like HTTP. TCP handles websites; UDP handles email"
          ],
          correct: 1,
          hint: "Section 5.4 on Network Protocols describes all four TCP/IP layers. The Transport Layer item explicitly defines both TCP and UDP and their use cases.",
          hintSection: "sec5-4",
          explanation: "The Transport Layer handles end-to-end communication. TCP provides reliable, ordered, error-checked delivery; UDP is fast and connectionless but without delivery guarantees."
        },
        {
          id: "q5-3",
          question: "Tim Berners-Lee is credited with inventing the World Wide Web. How is the World Wide Web distinct from the Internet?",
          options: [
            "The Internet is the browser software; the World Wide Web is the physical cables",
            "They are the same thing — 'World Wide Web' and 'Internet' are interchangeable terms",
            "The Internet is the global physical network infrastructure; the World Wide Web is an information system of interlinked documents built on top of the Internet",
            "The World Wide Web was invented before the Internet and served as its precursor"
          ],
          correct: 2,
          hint: "Section 5.5 explicitly distinguishes the Internet from the World Wide Web using a specific metaphor. Look for the word 'plumbing' to find the key distinction.",
          hintSection: "sec5-5",
          explanation: "The Internet is the global physical infrastructure (the 'plumbing'). The WWW is an information system of interlinked documents accessible via URLs and HTTP — one of many services running on the Internet."
        },
        {
          id: "q5-4",
          question: "The 'CIA Triad' is the foundation of cybersecurity. If a hospital database is attacked and patient records are altered without detection, which pillar of the CIA Triad has been violated?",
          options: [
            "Confidentiality — because patient data was accessed",
            "Availability — because the database was disrupted",
            "Integrity — because the data was altered without authorisation",
            "Authentication — because user identities were compromised"
          ],
          correct: 2,
          hint: "Section 5.6 defines all three pillars of the CIA Triad. 'Integrity' specifically addresses what happens when data is tampered with.",
          hintSection: "sec5-6",
          explanation: "Integrity ensures data is accurate and has not been tampered with. Altering patient records without detection is a direct violation of data integrity — the 'I' in the CIA Triad."
        },
        {
          id: "q5-5",
          question: "Ransomware has become one of the most damaging forms of cyberattack against organisations worldwide. Which definition correctly describes ransomware?",
          options: [
            "Software that secretly monitors a user's activity and reports it to a third party",
            "A type of attack that floods a server with traffic, making it unavailable",
            "Malicious software that encrypts the victim's data and demands payment for the decryption key",
            "An attack where a criminal impersonates a trusted entity to steal login credentials"
          ],
          correct: 2,
          hint: "Section 5.6 under Common Cyber Threats lists and defines different malware types. Find the bullet point specifically about ransomware.",
          hintSection: "sec5-6",
          explanation: "Ransomware encrypts the victim's data, making it inaccessible, then demands a ransom payment (typically in cryptocurrency) in exchange for the decryption key."
        }
      ]
    }

  ] // end modules
}; // end COURSE
