**Comparison Target**

- Source visual truth: `/Users/yuinakhon/.codex/generated_images/01a13ee8-ceeb-7932-ad29-6827d034de00/exec-8d01dd1e-a752-4112-9ad2-4887ff9cb357.png`
- Implementation: `.shots/closing-survey-option2-final-light/390x844-closing-survey-full.png`
- Side-by-side evidence: `.shots/design-qa-closing-survey-option2-side-by-side.png`
- Dark evidence: `.shots/closing-survey-option2-final-dark/390x844-closing-survey-full.png`
- Reduced-motion evidence: `.shots/closing-survey-option2-reduced/390x844-closing-survey-full.png`
- Viewport: 390 × 844 CSS px, device scale factor 1
- Source pixels: 853 × 1844; normalized source: 390 × 843
- Implementation element pixels: 390 × 1119; no density resampling
- State: survey locked before 26 October 2569; QR blurred; disabled action visible

**Findings**

- No actionable P0, P1, or P2 differences remain.
- Fonts and typography: live Anuphan and Chakra Petch preserve Thai readability and the navy/red hierarchy from the selected mock. The source uses hand-painted display lettering; live text is an intentional accessibility and responsive-product constraint.
- Spacing and layout rhythm: the illustration, three journey labels, invitation, survey name, QR, date, and disabled action follow the source order. The implementation is taller because it keeps the full survey title and a larger real QR state readable at 360px.
- Colors and visual tokens: the light view uses existing paper, visual-blue, ink, ink-2, and alarm-red tokens. The dark view uses the project's dark paper and text tokens rather than retaining the source's light-only palette.
- Image quality: the custom transparent watercolor asset preserves the approved brain, clipboard, journey line, and milestone pictograms without embedding text. It remains sharp at phone, tablet, and desktop sizes.
- Copy: the full existing survey name remains visible. The visible action remains exactly “เปิดลิงก์กิจกรรม”. The opening date remains 26 October 2569.
- Interaction state: before opening, the real QR remains blurred and the action is visibly disabled. Existing survey-time logic is reused without changes.

**Comparison History**

1. First implementation pass: the light composition matched the selected hierarchy and had no overflow, but dark mode mixed the static light-blue visual background into the dark theme, reducing text separation. Fixed by restoring the dark `paper` token while retaining the watercolor backdrop at low opacity.
2. Final comparison: light, dark, and reduced-motion states preserve the selected concept; no P0/P1/P2 findings remain.

**Browser Evidence**

- Rendered with the project Puppeteer/Chrome workflow at 360 × 640, 390 × 844, 768 × 1024, 1024 × 768, and 1280 × 800.
- No horizontal overflow was reported at those viewports.
- Dark mode was captured at 390 × 844 and 1024 × 768. Reduced motion was captured at 390 × 844.
- The primary pre-opening state was tested: QR blurred, date visible, action disabled.
- The only browser console/resource error was the local Umami proxy at `localhost:3012`, which was not running. The page route rendered HTTP 200 and the error is unrelated to this change.

**Focused Region Evidence**

- The element-level captures show the complete survey invitation, so a separate crop is not required. The QR/date/action region is readable at original pixel density in the full element screenshot.

**Follow-up Polish**

- P3: the mock uses a painted pink brush behind the red title. The implementation keeps the title as untextured live text to preserve clarity in both themes.

**Implementation Checklist**

- [x] Selected brain-journey concept reproduced
- [x] Full Thai survey name preserved
- [x] Real survey QR and opening-time gate preserved
- [x] QR blur preserved before opening
- [x] Disabled pre-opening action shown
- [x] Mobile, tablet, and desktop overflow check
- [x] Light, dark, and reduced-motion capture

final result: passed
