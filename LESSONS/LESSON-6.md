## Lesson 6: Setup Builder.io Visual CMS

**GitHub**: [Start](https://github.com/mhevery/qwik-workshop/tree/lesson-5) => [End](https://github.com/mhevery/qwik-workshop/tree/lesson-6) ([diff](https://github.com/mhevery/qwik-workshop/compare/lesson-5...lesson-6))

1. `npm run qwik add builder.io`
   - if `.env` gets over-written, revert it.
2. Create a new Builder.io account: https://www.builder.io/content
3. Add `PUBLIC_BUILDER_API_KEY=__YOUR_PUBLIC_KEY__` to your `.env.local`
   - You can use `474c56616e9c47a48feb292ef8aeb874` if you just want to use the content of the workshop.
4. Made the default homepage same as `src/routes/[...index]/index.tsx`

   ```typescript
   import LandingPage from "./[...index]/index";
   export { useBuilderContent } from "./[...index]/index";

   export default LandingPage;
   ```

5. Add your component to the Builder.io registry. Update `src/components/builder-registry.ts`

   ```typescript
   import Search from "../routes/github/index";

   export const CUSTOM_COMPONENTS: RegisteredComponent[] = [
     ...,
     {
       component: Search,
       name: "GitHub Search Component",
       inputs: [],
     },
   ];
   ```

Review:

- Created Builder.IO visual CMS account.
- Integrated Builder.IO with our application.
- Registered our component with Builder.IO.
- Used our component to allow it to be dragged and dropped into the page.
- Create multiple landing pages.
