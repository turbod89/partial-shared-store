import { PartiallySharedStore } from 'partially-shared-store/store';
import { SocialState } from './state';

export class SocialStore extends PartiallySharedStore<SocialState> {
  public readonly version = 'v1.0.0';
}
