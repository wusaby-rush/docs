import { CollectionEntry, defineCollection, z } from 'astro:content';

export const baseSchema = z
	.object({
		type: z.literal('base').optional().default('base'),
		title: z.string(),
		description: z.string().optional(),
		i18nReady: z.boolean().default(false),
		githubURL: z.string().url().optional(),
		hasREADME: z.boolean().optional(),
	})
	.strict();

export const deploySchema = baseSchema.extend({
	type: z.literal('deploy'),
});

export const backendSchema = baseSchema.extend({
	type: z.literal('backend'),
	stub: z.boolean().default(false),
	service: z.string(),
});

export const cmsSchema = baseSchema.extend({
	type: z.literal('cms'),
	stub: z.boolean().default(false),
	service: z.string(),
});

export const integrationSchema = baseSchema.extend({
	type: z.literal('integration'),
	title: z
		.string()
		.refine(
			(title) => title.startsWith('@astrojs/'),
			'"title" must start with "@astrojs/" for integration docs.'
		),
	category: z.enum(['renderer', 'adapter', 'other']),
	hasREADME: z.literal(true).default(true),
	githubURL: z.string().url(),
});

export const migrationSchema = baseSchema.extend({
	type: z.literal('migration'),
	framework: z.string(),
	stub: z.boolean().default(false),
});

export const tutorialSchema = baseSchema.extend({
	type: z.literal('tutorial'),
	unitTitle: z.string().optional(),
});

export const recipeSchema = baseSchema.extend({
	type: z.literal('recipe'),
	description: z.string(),
});

export type DeployEntry = CollectionEntry<'docs'> & {
	data: z.infer<typeof deploySchema>;
};

export type BackendEntry = CollectionEntry<'docs'> & {
	data: z.infer<typeof backendSchema>;
};

export type CmsEntry = CollectionEntry<'docs'> & {
	data: z.infer<typeof cmsSchema>;
};

export type IntegrationEntry = CollectionEntry<'docs'> & {
	data: z.infer<typeof integrationSchema>;
};

export type MigrationEntry = CollectionEntry<'docs'> & {
	data: z.infer<typeof migrationSchema>;
};

export type TutorialEntry = CollectionEntry<'docs'> & {
	data: z.infer<typeof tutorialSchema>;
};

export type RecipeEntry = CollectionEntry<'docs'> & {
	data: z.infer<typeof recipeSchema>;
};

export type IntegrationCategory = z.infer<typeof integrationSchema>['category'];

export function isBackendEntry(entry: CollectionEntry<'docs'>): entry is BackendEntry {
	return entry.data.type === 'backend';
}

export function isCmsEntry(entry: CollectionEntry<'docs'>): entry is CmsEntry {
	return entry.data.type === 'cms';
}

export function isIntegrationEntry(entry: CollectionEntry<'docs'>): entry is IntegrationEntry {
	return entry.data.type === 'integration';
}

export function isTutorialEntry(entry: CollectionEntry<'docs'>): entry is TutorialEntry {
	return entry.data.type === 'tutorial';
}

export function isMigrationEntry(entry: CollectionEntry<'docs'>): entry is MigrationEntry {
	return entry.data.type === 'migration';
}

export function isRecipeEntry(entry: CollectionEntry<'docs'>): entry is RecipeEntry {
	return entry.data.type === 'recipe';
}

export function createIsLangEntry(lang: string) {
	return function isLangEntry(entry: CollectionEntry<'docs'>): boolean {
		return entry.slug.startsWith(lang + '/');
	};
}

export const isEnglishEntry = createIsLangEntry('en');

const docs = defineCollection({
	schema: z.union([
		baseSchema,
		backendSchema,
		cmsSchema,
		integrationSchema,
		migrationSchema,
		tutorialSchema,
		deploySchema,
		recipeSchema,
	]),
});

export const collections = { docs };
