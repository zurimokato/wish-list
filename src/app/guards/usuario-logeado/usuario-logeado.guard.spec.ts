import { TestBed } from '@angular/core/testing';

import { UsuarioLogeadoGuard } from './usuario-logeado.guard';

describe('UsuarioLogeadoGuard', () => {
  let guard: UsuarioLogeadoGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(UsuarioLogeadoGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
