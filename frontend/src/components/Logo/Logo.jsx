import './Logo.css';
import logo from '../../assets/brand/logos/logo.svg';

export default function Logo({ light = false }) {
  return (
    <img
      className={`brand-logo ${light ? 'brand-logo-light' : ''}`}
      src={logo}
      alt="Verdia"
    />
  );
}
